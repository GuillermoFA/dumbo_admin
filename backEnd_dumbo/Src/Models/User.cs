using System.ComponentModel.DataAnnotations;

namespace backEnd_dumbo.Src.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Rut { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Los puntos son obligatorios.")]
        public string Points { get; set; } = string.Empty;

        // Entity Framework Core Relationships
        public int RoleId { get; set; }
        public Role? Role { get; set; }

    }
}