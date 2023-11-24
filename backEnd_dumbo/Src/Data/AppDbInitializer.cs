using backEnd_dumbo.Src.Models;

namespace backEnd_dumbo.Src.Data
{
    public class AppDbInitializer
    {
        public static void Seed(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
        
                var context = serviceScope.ServiceProvider.GetService<DataContext>();

                if (context == null)
                {
                    throw new InvalidOperationException("No se pudo obtener el contexto de la base de datos.");
                }

                context.Database.EnsureCreated();

                if(!context.Roles.Any())
                {
                     var roles = new List<Role>
                    {
                        new Role { Name = "Admin" },
                        new Role { Name = "User" }

                    };
                    context.Roles.AddRange(roles);
                    context.SaveChanges();
                }

                if(!context.Users.Any())
                {
                     var users = new List<User>
                {
                    new User { Rut = "19.955.559-5", Name = "Ochietto", LastName = "Araya", Email = "admin@admin.com", Password="Jaqamain3pals" , Points = 9999, RoleId = 1 },
                    new User { Rut = "15.519.350-1", Name = "Juan", LastName = "Pedro", Email = "jPedro@gmail.com", Points = 590, RoleId = 2 },
                    new User { Rut = "10.860.580-6", Name = "Alberto", LastName = "Labra", Email = "albert@constructora.cl", Points = 1000, RoleId = 2 },
                    new User { Rut = "21.560.368-5", Name = "Guillermo", LastName = "Fuentes", Email = "guillermofuentes24@gmail.com", Points = 500, RoleId = 2 },
                    new User { Rut = "24.416.459-9", Name = "Paz", LastName = "Alfaro", Email = "pazalfaro@centinela.cl", Points = 1500, RoleId = 2 },
                    new User { Rut = "18.580.999-1", Name = "Martina", LastName = "Alarcon", Email = "mpaz@gmail.com", Points = 2000, RoleId = 2 },


                };

                    context.Users.AddRange(users);
                    context.SaveChanges();

                }
                context.SaveChanges();

            }
        }
    }
}