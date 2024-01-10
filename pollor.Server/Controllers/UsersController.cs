using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using pollor.Server.Models;
using pollor.Server.Services;
using System.Data;
using System.Numerics;

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
        public List<UserModel> GeAllUsers()
        {
            string userByIdQuery = string.Format("SELECT * FROM users");
            List<UserModel> users = DBConnection.Instance().Query<UserModel>(userByIdQuery).ToList();
            return users;
        }

        [HttpGet("{id}")]
        public UserModel GetUserById(int id)
        {
            string userByIdQuery = string.Format("SELECT * FROM users WHERE id = @userId");
            UserModel user = DBConnection.Instance().QueryById<UserModel>(userByIdQuery, "@userId", id);
            //if (user == null) {
            //    _logger.LogWarning(MyLogEvents.GetItemNotFound, "Get(User/{Id}) NOT FOUND", id);
            //}
            return user;
        }
    }
}
