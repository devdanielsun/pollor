using System.ComponentModel.DataAnnotations;

namespace pollor.Server.Models
{
    public class RegisterModel
    {
        [Required, StringLength(256)]
        public string? emailaddress { get; set; }
        [Required, StringLength(64)]
        public string? username { get; set; }
        [Required, StringLength(128)]
        public string? password { get; set; }
        [Required, StringLength(128)]
        public string? confirmPassword { get; set; }
    }

    public class LoginModel
    {
        [Required, StringLength(64)]
        public string? username { get; set; }
        [Required, StringLength(128)]
        public string? password { get; set; }
        public bool tokenLongerValid { get; set; } = false;
    }

    public class ChangePasswordModel
    {
        [Required]
        public int? id { get; set; }
        [Required, StringLength(128)]
        public string? newpassword { get; set; }
        [Required, StringLength(128)]
        public string? confirmPassword { get; set; }
    }

    public class ValidateTokenModel
    {
        public string? token { get; set; }
        [Required, StringLength(32)]
        public string? role { get; set; }
    }
}