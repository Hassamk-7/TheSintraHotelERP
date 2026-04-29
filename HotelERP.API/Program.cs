using System.Text;
using HotelERP.API.Config;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Net.Http.Headers;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
QuestPDF.Settings.License = LicenseType.Community;

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection configuration.");
}

// Guardrail: never allow production to run against a local/Windows-auth connection string.
if (!builder.Environment.IsDevelopment())
{
    var cs = connectionString.ToLowerInvariant();
    if (cs.Contains("trusted_connection=true") || cs.Contains("integrated security=true") || cs.Contains("server=zubairkhalil"))
    {
        throw new InvalidOperationException("Invalid production DB connection string detected. Configure a real production SQL connection string.");
    }
}

builder.Services.AddDbContext<HotelDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("Jwt"));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<HotelDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        }

        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

builder.Services.AddScoped<IJwtService, JwtService>();

// Add Data Seeding Service
builder.Services.AddScoped<DataSeedingService>();
builder.Services.AddScoped<CalendarDataSeedingService>();

// Add System Service
builder.Services.AddScoped<HotelERPSystemService>();

// Add Email Service
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ICheckoutInvoiceService, CheckoutInvoiceService>();

// Add HttpClient for PayFast integration
builder.Services.AddHttpClient();

// Add BookLogic Channel Manager Service
builder.Services.AddHttpClient<HotelERP.API.Services.BookLogicService>();
builder.Services.AddScoped<HotelERP.API.Services.BookLogicService>();

// Add BookLogic Background Service for automatic reservation pulling
if (builder.Configuration.GetValue("BookLogic:EnableBackgroundService", true))
{
    builder.Services.AddHostedService<HotelERP.API.Services.BookLogicBackgroundService>();
}

// Add CORS
builder.Services.AddCors(options =>
{
    var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                            ?? Array.Empty<string>();

    var fallbackOrigins = new[]
    {
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:62750",
        "https://thesintrahotel.com",
        "https://www.thesintrahotel.com",
        "https://api.thesintrahotel.com"
    };

    var origins = (configuredOrigins.Length > 0 ? configuredOrigins : fallbackOrigins)
        .Where(origin => !string.IsNullOrWhiteSpace(origin))
        .Select(origin => origin.Trim().TrimEnd('/'))
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray();

    options.AddPolicy("CorsPolicy",
        policy =>
        {
            policy.SetIsOriginAllowed(origin => origins.Contains(origin.TrimEnd('/'), StringComparer.OrdinalIgnoreCase))
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
});

// Add controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new NullableDateTimeConverter());
    });

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hotel ERP API", Version = "v1" });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
try
{
    // Enable developer exception page for ALL environments to see errors
    app.UseDeveloperExceptionPage();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => 
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel ERP API v1");
            c.RoutePrefix = string.Empty; // Serve Swagger UI at root
        });
    }

    // Temporarily disable HTTPS redirection for development
    // app.UseHttpsRedirection();

    app.UseRouting();

    // Apply CORS before auth so preflight and cross-origin requests are handled correctly
    app.UseCors("CorsPolicy");

    // Enable static files from wwwroot (includes wwwroot/uploads)
    app.UseStaticFiles();

    app.UseAuthentication();
    app.UseAuthorization();

    // Map API controllers
    app.MapControllers();

    // API ONLY - No SPA routing needed (handled by IIS/root web.config)
}
catch (Exception ex)
{
    Console.WriteLine($"CRITICAL ERROR during app configuration: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    throw;
}

// Seed database with initial data
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<HotelDbContext>();

            // Apply migrations
            try
            {
                await context.Database.MigrateAsync();
            }
            catch (Exception migrationEx)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogWarning(migrationEx, "Migration warning (table may already exist, continuing...)");
            }

            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            const string developmentAdminEmail = "admin@hotelerp.com";
            const string developmentAdminPassword = "Admin@123";
            const string developmentAdminRole = "Admin";

            if (!await roleManager.RoleExistsAsync(developmentAdminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(developmentAdminRole));
            }

            var developmentAdminUser = await userManager.FindByEmailAsync(developmentAdminEmail);
            if (developmentAdminUser == null)
            {
                developmentAdminUser = new ApplicationUser
                {
                    UserName = developmentAdminEmail,
                    Email = developmentAdminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    LockoutEnabled = true
                };

                await userManager.CreateAsync(developmentAdminUser, developmentAdminPassword);
            }
            else
            {
                var shouldUpdateDevelopmentAdmin = false;

                if (string.IsNullOrWhiteSpace(developmentAdminUser.FirstName))
                {
                    developmentAdminUser.FirstName = "Admin";
                    shouldUpdateDevelopmentAdmin = true;
                }

                if (string.IsNullOrWhiteSpace(developmentAdminUser.LastName))
                {
                    developmentAdminUser.LastName = "User";
                    shouldUpdateDevelopmentAdmin = true;
                }

                if (!string.Equals(developmentAdminUser.UserName, developmentAdminEmail, StringComparison.OrdinalIgnoreCase))
                {
                    developmentAdminUser.UserName = developmentAdminEmail;
                    shouldUpdateDevelopmentAdmin = true;
                }

                if (!string.Equals(developmentAdminUser.Email, developmentAdminEmail, StringComparison.OrdinalIgnoreCase))
                {
                    developmentAdminUser.Email = developmentAdminEmail;
                    shouldUpdateDevelopmentAdmin = true;
                }

                if (!developmentAdminUser.EmailConfirmed)
                {
                    developmentAdminUser.EmailConfirmed = true;
                    shouldUpdateDevelopmentAdmin = true;
                }

                if (shouldUpdateDevelopmentAdmin)
                {
                    await userManager.UpdateAsync(developmentAdminUser);
                }

                if (!await userManager.CheckPasswordAsync(developmentAdminUser, developmentAdminPassword))
                {
                    var resetToken = await userManager.GeneratePasswordResetTokenAsync(developmentAdminUser);
                    await userManager.ResetPasswordAsync(developmentAdminUser, resetToken, developmentAdminPassword);
                }
            }

            if (developmentAdminUser != null && !await userManager.IsInRoleAsync(developmentAdminUser, developmentAdminRole))
            {
                await userManager.AddToRoleAsync(developmentAdminUser, developmentAdminRole);
            }

            // Seed other data - DISABLED to prevent startup errors
            // var seedingService = services.GetRequiredService<DataSeedingService>();
            // var calendarSeedingService = services.GetRequiredService<CalendarDataSeedingService>();
            //
            // await seedingService.SeedAllDataAsync();
            // await calendarSeedingService.SeedCalendarDataAsync();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.Run();

// Custom JSON converter to handle empty strings for nullable DateTime properties
public class NullableDateTimeConverter : System.Text.Json.Serialization.JsonConverter<DateTime?>
{
    public override DateTime? Read(ref System.Text.Json.Utf8JsonReader reader, Type typeToConvert, System.Text.Json.JsonSerializerOptions options)
    {
        if (reader.TokenType == System.Text.Json.JsonTokenType.Null)
            return null;

        if (reader.TokenType == System.Text.Json.JsonTokenType.String)
        {
            var str = reader.GetString();
            if (string.IsNullOrWhiteSpace(str) || str == "0001-01-01" || str == "0001-01-01T00:00:00")
                return null;

            if (DateTime.TryParse(str, out var date))
                return date;

            return null;
        }

        return reader.GetDateTime();
    }

    public override void Write(System.Text.Json.Utf8JsonWriter writer, DateTime? value, System.Text.Json.JsonSerializerOptions options)
    {
        if (value.HasValue)
            writer.WriteStringValue(value.Value);
        else
            writer.WriteNullValue();
    }
}
