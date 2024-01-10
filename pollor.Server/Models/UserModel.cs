using System.ComponentModel.DataAnnotations.Schema;

namespace pollor.Server.Models
{
    [Table("users")]
    public class UserModel : SuperModel
    {
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? profile_username { get; set; }
    }
}