using Microsoft.AspNetCore.Mvc;

namespace pollor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealth()
        {
            var healthyObject = new {
                healthy = "OK",
                ping = "Ping successful"
            };

            return Ok(healthyObject);
        }
    }
}
