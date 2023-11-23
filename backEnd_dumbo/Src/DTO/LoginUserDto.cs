using System.ComponentModel.DataAnnotations;

namespace backEnd_dumbo.Src.DTO
{
    public class LoginUserDto
    {
        
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}