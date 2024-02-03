using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
                        return NotFound(new { message = "No records found" });
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
                        return NotFound(new { message = "No records found" });
                    }
                    return Ok(vote);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpPost("vote")]
        [Authorize]
        public IActionResult AddVote(VoteModel vote)
        {
            try {
                using (var context = new PollorDbContext()) {
                    EntityEntry<VoteModel> newVote = context.Votes.Add(vote);
                    context.SaveChanges();

                    if (newVote == null) {
                        return NotFound(new { message = "No records found" });
                    }
                    return Created("vote/" + newVote.Entity.id.ToString(), newVote.Entity);
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500, new { message = ex.Message});
            }
        }
    }
}
