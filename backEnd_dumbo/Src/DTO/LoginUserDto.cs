using System.ComponentModel.DataAnnotations;

namespace backEnd_dumbo.Src.DTO
{
    public class LoginUserDto
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}