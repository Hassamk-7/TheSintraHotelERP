using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace HotelERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public BlogController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: api/Blog/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<object>>> GetCategories()
        {
            // Return all categories with post counts
            var categories = await _context.BlogCategories
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.CategoryName)
                .Select(c => new
                {
                    c.CategoryID,
                    c.CategoryName,
                    c.CategorySlug,
                    c.Description,
                    c.DisplayOrder,
                    c.IsActive,
                    c.CreatedBy,
                    c.CreatedDate,
                    c.ModifiedBy,
                    c.ModifiedDate,
                    PostCount = _context.Blogs.Count(b => b.CategoryID == c.CategoryID && b.IsActive && b.IsPublished)
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/Blog/categories/{id}
        [HttpGet("categories/{id}")]
        public async Task<ActionResult<BlogCategory>> GetCategory(int id)
        {
            var category = await _context.BlogCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // POST: api/Blog/categories
        [HttpPost("categories")]
        [AllowAnonymous]
        public async Task<ActionResult<BlogCategory>> CreateCategory(BlogCategory category)
        {
            category.CreatedDate = DateTime.Now;
            _context.BlogCategories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryID }, category);
        }

        // PUT: api/Blog/categories/{id}
        [HttpPut("categories/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateCategory(int id, BlogCategory category)
        {
            if (id != category.CategoryID)
            {
                return BadRequest();
            }

            category.ModifiedDate = DateTime.Now;
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Blog/categories/{id}
        [HttpDelete("categories/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.BlogCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            category.IsActive = false;
            category.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Blog
        [HttpGet]
        public async Task<ActionResult<object>> GetBlogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null,
            [FromQuery] string search = null,
            [FromQuery] bool? isFeatured = null,
            [FromQuery] bool? isPublished = null)
        {
            var query = _context.Blogs
                .Include(b => b.Category)
                .Where(b => b.IsActive);

            // Apply filters
            if (categoryId.HasValue)
            {
                query = query.Where(b => b.CategoryID == categoryId.Value);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b => b.Title.Contains(search) || b.Excerpt.Contains(search));
            }

            if (isFeatured.HasValue)
            {
                query = query.Where(b => b.IsFeatured == isFeatured.Value);
            }

            if (isPublished.HasValue)
            {
                query = query.Where(b => b.IsPublished == isPublished.Value);
            }

            var totalCount = await query.CountAsync();

            var blogs = await query
                .OrderByDescending(b => b.PublishedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BlogListDTO
                {
                    BlogID = b.BlogID,
                    Title = b.Title,
                    Slug = b.Slug,
                    Excerpt = b.Excerpt,
                    FeaturedImage = b.FeaturedImage,
                    CategoryName = b.Category.CategoryName,
                    CategoryID = b.CategoryID,
                    Author = b.Author,
                    PublishedDate = b.PublishedDate,
                    ReadTime = b.ReadTime,
                    IsFeatured = b.IsFeatured,
                    IsPublished = b.IsPublished,
                    ViewCount = b.ViewCount
                })
                .ToListAsync();

            return Ok(new
            {
                data = blogs,
                totalCount = totalCount,
                page = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        // GET: api/Blog/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDetailDTO>> GetBlog(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Contents)
                .Include(b => b.Images)
                .Include(b => b.TagMappings)
                    .ThenInclude(tm => tm.Tag)
                .FirstOrDefaultAsync(b => b.BlogID == id && b.IsActive);

            if (blog == null)
            {
                return NotFound();
            }

            var blogDetail = new BlogDetailDTO
            {
                BlogID = blog.BlogID,
                Title = blog.Title ?? "",
                Slug = blog.Slug ?? "",
                Excerpt = blog.Excerpt ?? "",
                FeaturedImage = blog.FeaturedImage ?? "",
                CategoryID = blog.CategoryID,
                Category = blog.Category,
                Author = blog.Author ?? "",
                PublishedDate = blog.PublishedDate,
                ReadTime = blog.ReadTime ?? "",
                IsFeatured = blog.IsFeatured,
                IsPublished = blog.IsPublished,
                ViewCount = blog.ViewCount,
                MetaTitle = blog.MetaTitle ?? "",
                MetaDescription = blog.MetaDescription ?? "",
                MetaKeywords = blog.MetaKeywords ?? "",
                ContentHTML = blog.Contents?.FirstOrDefault()?.ContentHTML ?? "",
                ContentText = blog.Contents?.FirstOrDefault()?.ContentText ?? "",
                Images = blog.Images?.Where(i => i.IsActive).OrderBy(i => i.DisplayOrder).ToList() ?? new List<BlogImage>(),
                Tags = blog.TagMappings?.Select(tm => tm.Tag?.TagName ?? "").Where(t => !string.IsNullOrEmpty(t)).ToList() ?? new List<string>()
            };

            return blogDetail;
        }

        // GET: api/Blog/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<BlogDetailDTO>> GetBlogBySlug(string slug)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Contents)
                .Include(b => b.Images)
                .Include(b => b.TagMappings)
                    .ThenInclude(tm => tm.Tag)
                .FirstOrDefaultAsync(b => b.Slug == slug && b.IsActive && b.IsPublished);

            if (blog == null)
            {
                return NotFound();
            }

            // Increment view count
            blog.ViewCount++;
            await _context.SaveChangesAsync();

            var blogDetail = new BlogDetailDTO
            {
                BlogID = blog.BlogID,
                Title = blog.Title ?? "",
                Slug = blog.Slug ?? "",
                Excerpt = blog.Excerpt ?? "",
                FeaturedImage = blog.FeaturedImage ?? "",
                CategoryID = blog.CategoryID,
                Category = blog.Category,
                Author = blog.Author ?? "",
                PublishedDate = blog.PublishedDate,
                ReadTime = blog.ReadTime ?? "",
                IsFeatured = blog.IsFeatured,
                IsPublished = blog.IsPublished,
                ViewCount = blog.ViewCount,
                MetaTitle = blog.MetaTitle ?? "",
                MetaDescription = blog.MetaDescription ?? "",
                MetaKeywords = blog.MetaKeywords ?? "",
                ContentHTML = blog.Contents?.FirstOrDefault()?.ContentHTML ?? "",
                ContentText = blog.Contents?.FirstOrDefault()?.ContentText ?? "",
                Images = blog.Images?.Where(i => i.IsActive).OrderBy(i => i.DisplayOrder).ToList() ?? new List<BlogImage>(),
                Tags = blog.TagMappings?.Select(tm => tm.Tag?.TagName ?? "").Where(t => !string.IsNullOrEmpty(t)).ToList() ?? new List<string>()
            };

            return blogDetail;
        }

        // GET: api/Blog/featured
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<BlogListDTO>>> GetFeaturedBlogs([FromQuery] int count = 3)
        {
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .Where(b => b.IsActive && b.IsPublished && b.IsFeatured)
                .OrderByDescending(b => b.PublishedDate)
                .Take(count)
                .Select(b => new BlogListDTO
                {
                    BlogID = b.BlogID,
                    Title = b.Title,
                    Slug = b.Slug,
                    Excerpt = b.Excerpt,
                    FeaturedImage = b.FeaturedImage,
                    CategoryName = b.Category.CategoryName,
                    CategoryID = b.CategoryID,
                    Author = b.Author,
                    PublishedDate = b.PublishedDate,
                    ReadTime = b.ReadTime,
                    IsFeatured = b.IsFeatured,
                    IsPublished = b.IsPublished,
                    ViewCount = b.ViewCount
                })
                .ToListAsync();

            return blogs;
        }

        // POST: api/Blog
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Blog>> CreateBlog(BlogCreateUpdateDTO blogDto)
        {
            // Generate slug if not provided
            if (string.IsNullOrEmpty(blogDto.Slug))
            {
                blogDto.Slug = GenerateSlug(blogDto.Title);
            }

            var blog = new Blog
            {
                Title = blogDto.Title,
                Slug = blogDto.Slug,
                Excerpt = blogDto.Excerpt,
                FeaturedImage = blogDto.FeaturedImage,
                CategoryID = blogDto.CategoryID,
                Author = blogDto.Author,
                PublishedDate = blogDto.PublishedDate,
                ReadTime = blogDto.ReadTime,
                IsFeatured = blogDto.IsFeatured,
                IsPublished = blogDto.IsPublished,
                MetaTitle = blogDto.MetaTitle,
                MetaDescription = blogDto.MetaDescription,
                MetaKeywords = blogDto.MetaKeywords,
                CreatedBy = blogDto.Author,
                CreatedDate = DateTime.Now
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            // Add content
            if (!string.IsNullOrEmpty(blogDto.ContentHTML))
            {
                var content = new BlogContent
                {
                    BlogID = blog.BlogID,
                    ContentHTML = blogDto.ContentHTML,
                    ContentText = blogDto.ContentText,
                    CreatedBy = blogDto.Author,
                    CreatedDate = DateTime.Now
                };
                _context.BlogContents.Add(content);
            }

            // Add tags
            if (blogDto.Tags != null && blogDto.Tags.Any())
            {
                foreach (var tagName in blogDto.Tags)
                {
                    var tagSlug = GenerateSlug(tagName);
                    var tag = await _context.BlogTags.FirstOrDefaultAsync(t => t.TagSlug == tagSlug);

                    if (tag == null)
                    {
                        tag = new BlogTag
                        {
                            TagName = tagName,
                            TagSlug = tagSlug,
                            CreatedDate = DateTime.Now
                        };
                        _context.BlogTags.Add(tag);
                        await _context.SaveChangesAsync();
                    }

                    var mapping = new BlogTagMapping
                    {
                        BlogID = blog.BlogID,
                        TagID = tag.TagID,
                        CreatedDate = DateTime.Now
                    };
                    _context.BlogTagMappings.Add(mapping);
                }
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlog), new { id = blog.BlogID }, blog);
        }

        // PUT: api/Blog/{id}
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateBlog(int id, BlogCreateUpdateDTO blogDto)
        {
            var blog = await _context.Blogs
                .Include(b => b.Contents)
                .Include(b => b.TagMappings)
                .FirstOrDefaultAsync(b => b.BlogID == id);

            if (blog == null)
            {
                return NotFound();
            }

            // Update blog properties
            blog.Title = blogDto.Title;
            blog.Slug = string.IsNullOrEmpty(blogDto.Slug) ? GenerateSlug(blogDto.Title) : blogDto.Slug;
            blog.Excerpt = blogDto.Excerpt;
            blog.FeaturedImage = blogDto.FeaturedImage;
            blog.CategoryID = blogDto.CategoryID;
            blog.Author = blogDto.Author;
            blog.PublishedDate = blogDto.PublishedDate;
            blog.ReadTime = blogDto.ReadTime;
            blog.IsFeatured = blogDto.IsFeatured;
            blog.IsPublished = blogDto.IsPublished;
            blog.MetaTitle = blogDto.MetaTitle;
            blog.MetaDescription = blogDto.MetaDescription;
            blog.MetaKeywords = blogDto.MetaKeywords;
            blog.ModifiedBy = blogDto.Author;
            blog.ModifiedDate = DateTime.Now;

            // Update content
            var existingContent = blog.Contents.FirstOrDefault();
            if (existingContent != null)
            {
                existingContent.ContentHTML = blogDto.ContentHTML;
                existingContent.ContentText = blogDto.ContentText;
                existingContent.ModifiedBy = blogDto.Author;
                existingContent.ModifiedDate = DateTime.Now;
            }
            else if (!string.IsNullOrEmpty(blogDto.ContentHTML))
            {
                var content = new BlogContent
                {
                    BlogID = blog.BlogID,
                    ContentHTML = blogDto.ContentHTML,
                    ContentText = blogDto.ContentText,
                    CreatedBy = blogDto.Author,
                    CreatedDate = DateTime.Now
                };
                _context.BlogContents.Add(content);
            }

            // Update tags
            _context.BlogTagMappings.RemoveRange(blog.TagMappings);

            if (blogDto.Tags != null && blogDto.Tags.Any())
            {
                foreach (var tagName in blogDto.Tags)
                {
                    var tagSlug = GenerateSlug(tagName);
                    var tag = await _context.BlogTags.FirstOrDefaultAsync(t => t.TagSlug == tagSlug);

                    if (tag == null)
                    {
                        tag = new BlogTag
                        {
                            TagName = tagName,
                            TagSlug = tagSlug,
                            CreatedDate = DateTime.Now
                        };
                        _context.BlogTags.Add(tag);
                        await _context.SaveChangesAsync();
                    }

                    var mapping = new BlogTagMapping
                    {
                        BlogID = blog.BlogID,
                        TagID = tag.TagID,
                        CreatedDate = DateTime.Now
                    };
                    _context.BlogTagMappings.Add(mapping);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Blog/{id}
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            blog.IsActive = false;
            blog.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Blog/{id}/toggle-featured
        [HttpPost("{id}/toggle-featured")]
        [AllowAnonymous]
        public async Task<IActionResult> ToggleFeatured(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            blog.IsFeatured = !blog.IsFeatured;
            blog.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { isFeatured = blog.IsFeatured });
        }

        // POST: api/Blog/{id}/toggle-publish
        [HttpPost("{id}/toggle-publish")]
        [AllowAnonymous]
        public async Task<IActionResult> TogglePublish(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            blog.IsPublished = !blog.IsPublished;
            blog.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { isPublished = blog.IsPublished });
        }

        // GET: api/Blog/stats
        [HttpGet("stats")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetBlogStats()
        {
            var totalBlogs = await _context.Blogs.CountAsync(b => b.IsActive);
            var publishedBlogs = await _context.Blogs.CountAsync(b => b.IsActive && b.IsPublished);
            var draftBlogs = await _context.Blogs.CountAsync(b => b.IsActive && !b.IsPublished);
            var featuredBlogs = await _context.Blogs.CountAsync(b => b.IsActive && b.IsFeatured);
            var totalViews = await _context.Blogs.Where(b => b.IsActive).SumAsync(b => b.ViewCount);
            var totalCategories = await _context.BlogCategories.CountAsync(c => c.IsActive);

            return Ok(new
            {
                totalBlogs,
                publishedBlogs,
                draftBlogs,
                featuredBlogs,
                totalViews,
                totalCategories
            });
        }

        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.BlogID == id);
        }

        private bool CategoryExists(int id)
        {
            return _context.BlogCategories.Any(e => e.CategoryID == id);
        }

        private string GenerateSlug(string title)
        {
            if (string.IsNullOrEmpty(title))
                return string.Empty;

            var slug = title.ToLower();
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", " ").Trim();
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s", "-");

            return slug;
        }
    }
}
