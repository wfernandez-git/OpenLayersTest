using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace MapboxTest.Pages
{
    //[EnableCors("GeoServerOrigins")]
    public class IndexModel : PageModel
    {
        public string? Okta_Access_Token => _context?.HttpContext?.Request?.Cookies["access_token"];
        private const string tenant_id = "q12345";
        private const string product_id = "landdox";

        private readonly ILogger<IndexModel> _logger;
        private readonly IHttpContextAccessor _context;

        public IndexModel(ILogger<IndexModel> logger, IHttpContextAccessor context)
        {
            _logger = logger;
            _context = context;
        }

        public void OnGet()
        {

        }


        public async Task<IActionResult> OnGetOktaTokenAsync()
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var cred = Convert.ToBase64String(Encoding.ASCII.GetBytes($"0oa187ptj73aV9MrQ0h8:frKml1a_Hl4H91JWT8Wm9PjHRvzaBRcnfGQb8WjA"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", cred);
            var resp = await httpClient.PostAsync("https://quorum.oktapreview.com/oauth2/default/v1/token",
                new FormUrlEncodedContent(new KeyValuePair<string, string>[] { new KeyValuePair<string, string>("grant_type", "client_credentials") }));
            if (resp.IsSuccessStatusCode)
            {
                var oktaToken = await resp.Content.ReadFromJsonAsync<OktaToken>();
                if (oktaToken == null) return new BadRequestResult();

                Response.Cookies.Append("access_token", oktaToken.access_token);
                return new OkObjectResult(oktaToken.access_token);
            }
            return new BadRequestResult();
        }



        public async Task<IActionResult> OnGetCreateGeoServerSecurityAsync()
        {
            //Make sure that the token is available
            var token = _context?.HttpContext?.Request.Cookies["access_token"];
            if (string.IsNullOrEmpty(token)) return new BadRequestObjectResult("The token was not found");


            var handler = new HttpClientHandler { ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator };
            HttpClient httpClient = new HttpClient(handler);
            var url = $"https://localhost:7071/api/geoserver/security?tenant_id={tenant_id}&product={product_id}";

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var resp = await httpClient.PostAsync(url,
                new StringContent(
                    @"{
                      'host': 'postgresqlsvr-maps-test.postgres.database.azure.com',
                      'port': '5432',
                      'database': 'map_service',
                      'user': 'mapserviceadmin',
                      'password': '8&N6u4vPYnQZfJ'
                    }
            "));

            if (resp.IsSuccessStatusCode)
            {
                var txt = await resp.Content.ReadAsStringAsync();
                var gsCred = JsonConvert.DeserializeObject<GeoServerCredentials>(txt);
                if (gsCred == null) return new BadRequestResult();

                Response.Cookies.Append("gs_username", gsCred.userName);
                if (!string.IsNullOrEmpty(gsCred.password))
                {
                    Response.Cookies.Append("gs_pwd", gsCred.password);
                }
                return new OkObjectResult(txt);
            }
            return new BadRequestResult();
        }


        public async Task<IActionResult> OnGetCreateGeoServerLayersAsync(string featureName, string filter)
        {
            //Make sure that the token is available
            var token = _context?.HttpContext?.Request.Cookies["access_token"];
            if (string.IsNullOrEmpty(token)) return new BadRequestObjectResult("The token was not found");


            var handler = new HttpClientHandler { ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator };
            HttpClient httpClient = new HttpClient(handler);
            var jsonBody = $@"{{
                  ""featureType"": ""{featureName}"",
                  ""filter"": ""{filter}"",
                  ""minx"": -100.71954989327097,
                  ""miny"": -78.8487969948206,
                  ""maxx"": 146.80112537453005,
                  ""maxy"": 79.88926711626783
                }}";

            var url = $"https://localhost:7071/api/geoserver/featuretype?tenant_id={tenant_id}&product={product_id}";
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var resp = await httpClient.PostAsync(url,new StringContent(jsonBody));

            if (resp.IsSuccessStatusCode)
            {
                var txt = await resp.Content.ReadAsStringAsync();
                //var gsCred = JsonConvert.DeserializeObject<GeoServerCredentials>(txt);
                return new OkObjectResult(txt);
            }
            return new BadRequestObjectResult(resp.ReasonPhrase);
        }


        class OktaToken
        {
            public string token_type { get; set; }
            public string access_token { get; set; }
            public string scope { get; set; }
            public long expires_in { get; set; }
        }

        class GeoServerCredentials
        {
            public string workspaceName { get; set; }
            public string roleName { get; set; }
            public string userName { get; set; }
            public string password { get; set; }
            public string datastoreName { get; set; }
        }
    }
}