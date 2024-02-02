using System.ComponentModel.DataAnnotations;

namespace pollor.Server.Models
{
    public class RegisterModel
    {
        [Required]
        public string? emailaddress { get; set; }
        [Required]
        public string? username { get; set; }
        [Required]
        public string? password { get; set; }
    }

    public class LoginModel
    {
        [Required]
        public string? username { get; set; }
        [Required]
        public string? password { get; set; }
        public bool tokenLongerValid { get; set; } = false;
    }

    public class ChangePasswordModel
    {
        [Required]
        public int? id { get; set; }
        [Required]
        public string? newpassword { get; set; }
        [Required]
        public string? confirmPassword { get; set; }
    }
}