using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayfastController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<PayfastController> _logger;
        private readonly IConfiguration _configuration;

        public PayfastController(IHttpClientFactory httpClientFactory, ILogger<PayfastController> logger, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("GetAccessToken")]
        public async Task<IActionResult> GetAccessToken([FromBody] AuthRequest authRequest)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var payfastTokenUrl = _configuration["PayFast:TokenUrl"] ?? "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken";
                
                var requestContent = new StringContent(
                    JsonConvert.SerializeObject(authRequest), 
                    Encoding.UTF8, 
                    "application/json"
                );

                var response = await client.PostAsync(payfastTokenUrl, requestContent);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseContent);
                    
                    return Ok(tokenResponse);
                }

                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"PayFast token request failed: {errorContent}");
                
                return BadRequest(new { error = "Failed to get access token", details = errorContent });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayFast access token");
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        [HttpPost("ProcessPayment")]
        public async Task<IActionResult> ProcessPayment([FromBody] PayfastPaymentRequest paymentRequest)
        {
            try
            {
                var merchantId = _configuration["PayFast:MerchantId"] ?? "23741";
                var securedKey = _configuration["PayFast:SecuredKey"] ?? "PDIqK1FZZqKaCDPKerzWZX28";
                var secretWord = _configuration["PayFast:SecretWord"] ?? string.Empty;
                var payfastTokenUrl = _configuration["PayFast:TokenUrl"] ?? "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken";
                var payfastPaymentUrl = _configuration["PayFast:PaymentUrl"] ?? "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";
                var successUrl = _configuration["PayFast:SuccessUrl"] ?? $"https://thesintrahotel.com/reservation/thankyou?status=success&basket_id={paymentRequest.BasketId}";
                var failureUrl = _configuration["PayFast:FailureUrl"] ?? $"https://thesintrahotel.com/reservation/thankyou?status=failed&basket_id={paymentRequest.BasketId}";
                var checkoutUrl = _configuration["PayFast:CheckoutUrl"] ?? "https://typedwebhook.tools/webhook/cfe4e40e-8c5c-4d5b-867a-017bce41070c";

                // First get access token
                var authRequest = new AuthRequest
                {
                    MERCHANT_ID = merchantId,
                    SECURED_KEY = securedKey,
                    TXNAMT = paymentRequest.Amount,
                    BASKET_ID = paymentRequest.BasketId,
                    CURRENCY_CODE = "PKR"
                };

                var client = _httpClientFactory.CreateClient();
                var tokenRequestContent = new StringContent(
                    JsonConvert.SerializeObject(authRequest), 
                    Encoding.UTF8, 
                    "application/json"
                );

                var tokenResponse = await client.PostAsync(payfastTokenUrl, tokenRequestContent);
                
                if (!tokenResponse.IsSuccessStatusCode)
                {
                    var errorContent = await tokenResponse.Content.ReadAsStringAsync();
                    return BadRequest(new { error = "Failed to get access token", details = errorContent });
                }

                var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
                var token = JsonConvert.DeserializeObject<TokenResponse>(tokenContent);

                // Generate signature
                string signature = GenerateSignature(merchantId, paymentRequest.Amount.ToString(), paymentRequest.BasketId, secretWord);

                // Prepare payment data
                var paymentData = new Dictionary<string, string>
                {
                    { "CURRENCY_CODE", "PKR" },
                    { "MERCHANT_ID", merchantId },
                    { "TOKEN", token.ACCESS_TOKEN },
                    { "SUCCESS_URL", successUrl },
                    { "FAILURE_URL", failureUrl },
                    { "CHECKOUT_URL", checkoutUrl },
                    { "CUSTOMER_EMAIL_ADDRESS", paymentRequest.CustomerEmail },
                    { "TXNAMT", paymentRequest.Amount.ToString() },
                    { "BASKET_ID", paymentRequest.BasketId },
                    { "ORDER_DATE", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") },
                    { "SIGNATURE", signature },
                    { "VERSION", "MERCHANT-CART-0.1" },
                    { "TXNDESC", "Hotel Room Booking Payment" },
                    { "PROCCODE", "00" },
                    { "TRAN_TYPE", "ECOMM_PURCHASE" },
                    { "STORE_ID", "" },
                    { "RECURRING_TXN", "true" }
                };

                return Ok(new PaymentRedirectResponse
                {
                    PaymentUrl = payfastPaymentUrl,
                    PaymentData = paymentData,
                    Token = token.ACCESS_TOKEN,
                    BasketId = paymentRequest.BasketId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing PayFast payment");
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        [HttpPost("VerifyPayment")]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationRequest request)
        {
            try
            {
                // Here you would typically verify the payment with PayFast
                // For now, we'll return a success response
                // In production, you should verify the signature and payment status
                
                return await Task.FromResult(Ok(new PaymentVerificationResponse
                {
                    IsSuccess = true,
                    TransactionId = request.BasketId,
                    Amount = request.Amount,
                    Status = "COMPLETED"
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying PayFast payment");
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        private string GenerateSignature(string merchantId, string transactionAmount, string basketId, string secretWord)
        {
            string responseString = $"{merchantId}{basketId}{secretWord}{transactionAmount}";
            
            using (MD5 md5 = MD5.Create())
            {
                byte[] hashBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(responseString));
                StringBuilder sb = new StringBuilder();
                
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                
                return sb.ToString();
            }
        }
    }

    // Request/Response Models
    public class AuthRequest
    {
        public string MERCHANT_ID { get; set; }
        public string SECURED_KEY { get; set; }
        public string BASKET_ID { get; set; }
        public string CURRENCY_CODE { get; set; }
        public decimal TXNAMT { get; set; }
    }

    public class TokenResponse
    {
        public string ACCESS_TOKEN { get; set; }
    }

    public class PayfastPaymentRequest
    {
        public string BasketId { get; set; }
        public decimal Amount { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerName { get; set; }
    }

    public class PaymentRedirectResponse
    {
        public string PaymentUrl { get; set; }
        public Dictionary<string, string> PaymentData { get; set; }
        public string Token { get; set; }
        public string BasketId { get; set; }
    }

    public class PaymentVerificationRequest
    {
        public string BasketId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
    }

    public class PaymentVerificationResponse
    {
        public bool IsSuccess { get; set; }
        public string TransactionId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }
}
