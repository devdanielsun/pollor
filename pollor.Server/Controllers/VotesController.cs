using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using pollor.Server.Models;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class VotesController : ControllerBase
    {
        private readonly ILogger<VotesController> _logger;

        public VotesController(ILogger<VotesController> logger)
        {
            _logger = logger;
        }

        [HttpGet("votes")]
        public IActionResult GetAllVotes()
        {
            try {
                using (var context = new PollorDbContext()) {
                    List<VoteModel>? votes = context.Votes.ToList();
                    if (votes.IsNullOrEmpty()) {
                        return NotFound();
                    }
                    return Ok(votes);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("vote/{id}")]
        public IActionResult GetVoteById(int id)
        {
            try {
                using (var context = new PollorDbContext()) {
                    VoteModel? vote = context.Votes
                        .Where(v => v.id.Equals(id))
                        .FirstOrDefault();
                    if (vote == null) {
                        return NotFound();
                    }
                    return Ok(vote);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
