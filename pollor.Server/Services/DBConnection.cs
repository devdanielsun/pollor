using System.ComponentModel;
using FastMember;
using MySql.Data.MySqlClient;
using MySqlX.XDevAPI.Common;

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

        public static T ConvertToObject<T>(MySqlDataReader rd) where T : class, new()
        {
            Type type = typeof(T);
            var accessor = TypeAccessor.Create(type);
            var members = accessor.GetMembers();
            var t = new T();

            for (int i = 0; i < rd.FieldCount; i++)
            {
                if (!rd.IsDBNull(i))
                {
                    string fieldName = rd.GetName(i);

                    if (members.Any(m => string.Equals(m.Name, fieldName, StringComparison.OrdinalIgnoreCase)))
                    {
                        accessor[t, fieldName] = rd.GetValue(i);
                    }
                }
            }

            return t;
        }   

        public T RunSelectQuery<T>(Type type, string query)
        {
            try // implement proper error handling
            {
                this.IsConnect();
                MySqlCommand cmd = new MySqlCommand(query, Connection);
                MySqlDataReader rdr = cmd.ExecuteReader();
                ConvertToObject<T>(rdr);
                using MySqlDataReader rdr = cmd.ExecuteReader();
                Console.WriteLine($"{rdr.GetName(0),-4} {rdr.GetName(1),-10} {rdr.GetName(2),10}");

                while (rdr.Read())
                {
                    rdr.
                    Console.WriteLine($"{rdr.GetInt32(0),-4} {rdr.GetString(1),-10} {rdr.GetInt32(2),10}");
                }

            }
            catch(Exception ex)
            {
                // error here
                Console.WriteLine(ex.ToString());
                throw new WarningException(ex.ToString());

            }
            return data;
        }
    }
}