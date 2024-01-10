using Microsoft.AspNetCore.Mvc;
using pollor.Server.Models;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VotesController : ControllerBase
    {
        private readonly ILogger<VotesController> _logger;

        public VotesController(ILogger<VotesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetVotesController")]
        public List<VoteModel> GetAllVotes()
        {
            string query_votes = string.Format("SELECT * FROM votes");
            try
            {
                return DBConnection.Instance().Query<VoteModel>(query_votes).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return null;
        }

        [HttpGet("{id}")]
        public VoteModel GetVoteById(int id)
        {
            string voteByIdQuery = string.Format("SELECT * FROM votes WHERE id = @voteId");
            try
            {
                VoteModel vote = DBConnection.Instance().QueryById<VoteModel>(voteByIdQuery, "@voteId", id);
                //if (vote == null) {
                //    _logger.LogWarning(MyLogEvents.GetItemNotFound, "Get(Votes/{Id}) NOT FOUND", id);
                //}
                return vote;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return null;
        }
    }
}
