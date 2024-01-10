using Microsoft.AspNetCore.Mvc;
using pollor.Server.Models;
using pollor.Server.Services;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetUsersController")]
        public List<UserModel> GetAllUsers()
        {
            string query_users = string.Format("SELECT * FROM users");
            try
            {
                return DBConnection.Instance().Query<UserModel>(query_users).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return null;
        }

        [HttpGet("{id}")]
        public UserModel GetUserById(int id)
        {
            string userByIdQuery = string.Format("SELECT * FROM users WHERE id = @userId");
            try {
                UserModel user = DBConnection.Instance().QueryById<UserModel>(userByIdQuery, "@userId", id);
                //if (user == null) {
                //    _logger.LogWarning(MyLogEvents.GetItemNotFound, "Get(Users/{Id}) NOT FOUND", id);
                //}
            return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return null;
        }
    }
}
