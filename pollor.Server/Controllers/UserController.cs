using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using pollor.Server.Model;
using pollor.Server.Service;

namespace pollor.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        private List<UserModel> RunSelectQueryForMetadata(string query)
        {
            var rdr = new MySqlCommand(query, DBConnection.Instance().Connection).ExecuteReader();
            var metadata = new List<UserModel>();
            using (rdr)
            {
                while(rdr.Read())
                {
                    metadata.Add(
                        new UserModel {
                            Id = rdr["id"],
                            Title = rdr["title"],
                            Sku = rdr["sku"],
                            IsLive = rdr["islive"],
                        });
                } // while
            } // using 

            return metadata;

        }

        [HttpGet(Name = "GetUserByID")]
        public UserModel GetUserById(int userId)
        {
            MySqlConnection connection = DBConnection.Instance().Connection;
            MySqlCommand userById_cmd = connection.CreateCommand();

            userById_cmd.CommandText = "SELECT * FROM users WHERE id = @userId;";
            userById_cmd.Parameters.AddWithValue("@userId", userId);

            connection.
            MySqlDataReader reader = userById_cmd.ExecuteReader();


            UserModel userTable = reader.Cast<UserModel>();
            UserModel userTable = new UserModel();
            return userTable;
        }

        [HttpGet(Name = "GetUsers")]
        public List<UserModel> GetUsers()
        {
            string userByIdQuery = string.Format("select * from users");
            MySqlConnection con = DBConnection.Instance().Connection;
            MySqlCommand MyCommand2 = new MySqlCommand(userByIdQuery, con);
            MySqlDataAdapter MyAdapter = new MySqlDataAdapter();
            MyAdapter.SelectCommand = MyCommand2;
            List<UserModel> usersTable = new List<UserModel>();
            MyCommand2.Parameters.
            MyAdapter.fill(usersTable);
            return usersTable;
        }
    }
}
