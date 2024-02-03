using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    public class SuperModel
    {
        [Key, Column("id")]
        public int id { get; set; }
        public DateTime created_at { get; set; }

    }
}

