using MySql.Data.MySqlClient;

namespace pollor.Server.Service
{
    public class DBConnection
    {
        private DBConnection() {
            server = Environment.GetEnvironmentVariable("DB_SERVER")!;
            databaseName = Environment.GetEnvironmentVariable("DB_NAME")!;
            userName = Environment.GetEnvironmentVariable("DB_USERNAME")!;
            password = Environment.GetEnvironmentVariable("DB_PASSWORD")!;
            
            /* If values are null or empty, give error message that values are missing in .env */
            if(String.IsNullOrEmpty(server)) {
                throw new InvalidOperationException("Database Server contains no value. Make sure DB_SERVER is set in .env");
            }
            if(String.IsNullOrEmpty(databaseName)) {
                throw new InvalidOperationException("Database Name contains no value. Make sure DB_SERVER is set in .env");
            }
            if(String.IsNullOrEmpty(userName)) {
                throw new InvalidOperationException("Database Username contains no value. Make sure DB_SERVER is set in .env");
            }
            if(String.IsNullOrEmpty(password)) {
                throw new InvalidOperationException("Database Password contains no value. Make sure DB_SERVER is set in .env");
            }
        }

        public string server { get; set; }
        public string databaseName { get; set; }
        public string userName { get; set; }
        public string password { get; set; }

        public MySqlConnection Connection { get; set;}

        private static DBConnection _instance = null!;
        public static DBConnection Instance()
        {
            if (_instance == null)
                _instance = new DBConnection();
            return _instance;
        }

        public bool IsConnect()
        {
            if (Connection == null)
            {
                if (String.IsNullOrEmpty(databaseName))
                    return false;
                string connstring = string.Format("Server={0}; database={1}; UID={2}; password={3}", server, databaseName, userName, password);
                Connection = new MySqlConnection(connstring);
                Connection.Open();
            }

            return true;
        }

        public void Close()
        {
            Connection.Close();
        }        
    }
}