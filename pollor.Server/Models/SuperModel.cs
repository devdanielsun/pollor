using System.Data;

namespace pollor.Server.Model
{
    public class SuperModel : DataSet
    {
        public int id { get; set; }

        public DateTime created_at { get; set; }

    }
}
