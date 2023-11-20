namespace backEnd_dumbo.Src.Models
{
    public class Role
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        //Entity Framework Core Relationships
        public List<User> Users { get; set; } = new();
    }
}