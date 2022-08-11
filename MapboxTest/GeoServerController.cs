using Microsoft.AspNetCore.Mvc;

namespace MapboxTest
{
    public class GeoServerController : Controller
    {
        public IActionResult GetToken(string url, string user, string pwd)
        {
            return View();
        }
    }
}
