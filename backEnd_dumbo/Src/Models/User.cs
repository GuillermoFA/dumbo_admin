namespace backEnd_dumbo.Src.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Rut { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;


        public string Points { get; set; } = string.Empty;

        // Entity Framework Core Relationships
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;


    }
}