using backEnd_dumbo.Src.Models;
using Microsoft.EntityFrameworkCore;

namespace backEnd_dumbo.Src.Data
{
    public class DataContext : DbContext
    {
        // Entity Framework create Users table
        public DbSet<User> Users { get; set; } = null!;

        // Entity Framework create Roles table
        public DbSet<Role> Roles { get; set; } = null!;
        public DataContext(DbContextOptions options) : base(options)
        {
        }

    }
}