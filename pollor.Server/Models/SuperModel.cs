using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    public class SuperModel
    {
        [Key, Column("id")]
        public int Id { get; set; }
        public DateTime Created_at { get; set; }

    }
}

