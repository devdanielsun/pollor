using Dapper;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.Data.SqlClient;
using static Dapper.SqlMapper;

namespace pollor.Server.Services
{
    public class DBConnection
    {
        private static DBConnection? _instance;
        private string connectionString;

        private DBConnection()
        {
            string dbServer = Environment.GetEnvironmentVariable("DB_SERVER")!;
            string dbName = Environment.GetEnvironmentVariable("DB_NAME")!;
            string dbUID = Environment.GetEnvironmentVariable("DB_UID")!;
            string dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD")!;

            bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            if (isDevelopment) {
                connectionString = string.Format("Server={0};Initial Catalog={1};Integrated Security={2};TrustServerCertificate={3}", dbServer, dbName, true, true);
            } else { // Production
                connectionString = string.Format("Server={0};Initial Catalog={1};User ID={2};Password={3};Persist Security Info={4};TrustServerCertificate={5};MultipleActiveResultSets={6};Encrypt={7};Connection Timeout={8}",
                    dbServer, dbName, dbUID, dbPassword, false, false, false, true, 30);
            }
        }

        public static DBConnection Instance()
        {
            if (_instance == null)
            {
                _instance = new DBConnection();
            }

            return _instance;
        }

        /* QUERY
        * example paramenters
        * query: "SELECT * FROM Books WHERE Author = @authorName"
        * where: new { authorName = "John Smith" }
        */
        public IEnumerable<T> Query<T>(string query)
        {

            using (var _connection = new SqlConnection(connectionString))
            {
                try
                {
                    return _connection.Query<T>(query);
                }
                catch (Exception ex) {
                    throw new Exception(ex.Message);
                }
            }
        }

        /* QUERY
        * example paramenters
        * query: "SELECT * FROM Books WHERE Author = @authorName"
        * where: new { authorName = "John Smith" }
        */
        public T QueryById<T>(string query, string whereClass, int id)
        {

            using (var _connection = new SqlConnection(connectionString))
            {
                try
                {
                    DynamicParameters param = new DynamicParameters();
                    param.Add(whereClass, id);
                    return _connection.QueryFirstOrDefault<T>(query, param);
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }
    }
}