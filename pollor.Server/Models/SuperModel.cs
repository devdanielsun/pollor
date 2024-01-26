using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    public class SuperModel
    {

        [Column("id")]
        public int Id { get; set; }
        public DateTime Created_at { get; set; }

    }
}

