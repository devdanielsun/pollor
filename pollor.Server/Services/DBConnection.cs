using Dapper;
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
            string dbIntegratedSecurity = Environment.GetEnvironmentVariable("DB_INTEGRATEDSECURITY")!;
            string dbTrustServerCertificate = Environment.GetEnvironmentVariable("DB_TRUSTSERVERCERT")!;

            //connectionString = string.Format("Server={0};Initial Catalog={1};Integrated Security={2};TrustServerCertificate={3}", dbServer, dbName, dbIntegratedSecurity, dbTrustServerCertificate);
            connectionString = string.Format("Server={0};Database={1};UID={2};PWD={3};Integrated Security={4};TrustServerCertificate={5}", dbServer, dbName, dbUID, dbPassword, dbIntegratedSecurity, dbTrustServerCertificate);
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
                return _connection.Query<T>(query);
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
                DynamicParameters param = new DynamicParameters();
                param.Add(whereClass, id);
                return _connection.QueryFirstOrDefault<T>(query, param);
            }
        }
    }
}