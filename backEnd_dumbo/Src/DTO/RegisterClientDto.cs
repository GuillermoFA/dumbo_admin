using System.ComponentModel.DataAnnotations;

namespace backEnd_dumbo.Src.DTO
{
    public class RegisterClientDto
    {
        [Required]
        public string Rut { get; set; } = string.Empty;

        [Required]
        [MinLength(5)]
        [MaxLength(15)]
        public string Name { get; set; } = string.Empty;

        [EmailAddress]
        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        [MaxLength(16)]
        public string Password { get; set; } = string.Empty;
        
    }
}