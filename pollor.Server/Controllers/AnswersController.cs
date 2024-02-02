using Microsoft.AspNetCore.Mvc;
using pollor.Server.Services;
using pollor.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace answeror.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AnswersController : ControllerBase
    {
        private readonly ILogger<AnswersController> _logger;

        public AnswersController(ILogger<AnswersController> logger)
        {
            _logger = logger;
        }

        [HttpGet("answers")]
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

        [HttpGet("answer/{id}")]
        public IActionResult GetAnswerById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    AnswerModel? answer = context.Answers
                        .Where(p => p.id.Equals(id))
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

        [HttpPost("answer")]
        [Authorize]
        public IActionResult AddAnswer(AnswerModel answer)
        {
            try {
                using (var context = new PollorDbContext()) {
                    EntityEntry<AnswerModel> newAnswer = context.Answers.Add(answer);
                    context.SaveChanges();

                    if (newAnswer == null) {
                        return NotFound(newAnswer);
                    }
                    return Created("answer/" + newAnswer.Entity.id.ToString(), newAnswer.Entity);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
