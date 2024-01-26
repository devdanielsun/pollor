using Microsoft.AspNetCore.Mvc;
using pollor.Server.Services;
using pollor.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace answeror.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AnswersController : ControllerBase
    {
        private readonly ILogger<AnswersController> _logger;

        public AnswersController(ILogger<AnswersController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetAnswersController")]
        public IActionResult GetAllAnswers()
        {
            try {
                using (var context = new PollorDbContext()) {
                    List<AnswerModel> answers = context.Answers
                        .Include(a => a.Votes)
                        .ToList();
                    if (answers.IsNullOrEmpty()) {
                        return NotFound();
                    }
                    return Ok(answers);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetAnswerById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    AnswerModel? answer = context.Answers
                        .Where(p => p.Id.Equals(id))
                        .Include(a => a.Votes)
                        .FirstOrDefault();
                    if (answer == null) {
                        return NotFound();
                    }
                    return Ok(answer);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
