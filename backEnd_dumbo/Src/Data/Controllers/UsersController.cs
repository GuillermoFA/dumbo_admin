using System.Text.RegularExpressions;
using backEnd_dumbo.Src.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backEnd_dumbo.Src.Data.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private static readonly string rutPattern = @"^(\d{1,3}(?:\.\d{1,3}){2}-[\dK])$";
        private static readonly string emailPattern = @"^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
        readonly Regex rutgx = new Regex(rutPattern);
        readonly Regex emailgx = new Regex(emailPattern);


        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
        }


        // Get users except admin
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsersExceptAdmin()
        {
            var users = await _context.Users.Where(u => u.RoleId != 1).ToListAsync();
            return users;
        }

        // Get user by id
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // Post new user with rol client
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var existingEmail = await _context.Users.AnyAsync(u => u.Email == user.Email);
            if (existingEmail)
            {
                return BadRequest(new { ErrorMessage = "El correo ya está registrado en el sistema." });
            }

            var existingRut = await _context.Users.AnyAsync(u => u.Rut == user.Rut);
            if (existingRut)
            {
                return BadRequest(new { ErrorMessage = "El RUT ya está registrado en el sistema." });
            }

             if (user.Points < 0)
            {
                return BadRequest(new { ErrorMessage = "Los puntos no pueden ser un valor negativo." });
            }

            if (rutgx.IsMatch(user.Rut) && emailgx.IsMatch(user.Email))
            {
                var salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
                var newUser = new User()
                {
                    Rut = user.Rut,
                    Email = user.Email,
                    Name = user.Name,
                    LastName = user.LastName,
                    Points = user.Points,
                    Password = passwordHash,
                    RoleId = 2

                };
                var createdUser = (await _context.Users.AddAsync(newUser)).Entity;
                await _context.SaveChangesAsync();
                return createdUser;
            }
            else
            {
                return BadRequest(new { ErrorMessage = "Invalid RUT or Email format." });
            }
        }

        // Update user with rol client
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> PutUser(int id, [FromBody] User user)
        {
            var existingUser = await _context.Users.FindAsync(id);

            if (existingUser == null)
            {
                return NotFound(new { ErrorMessage = "Usuario no encontrado." });
            }

            // Validar el modelo antes de realizar cambios
            if (!ModelState.IsValid)
            {
                return BadRequest(new { ErrorMessage = "La solicitud contiene datos no válidos.", Errors = ModelState.Values.SelectMany(v => v.Errors) });
            }
            

             if (user.Points < 0)
            {
                return BadRequest(new { ErrorMessage = "Los puntos no pueden ser un valor negativo." });
            }

            // Validar RUT y Email
            if (rutgx.IsMatch(user.Rut) && emailgx.IsMatch(user.Email))
            {
                existingUser.Rut = user.Rut;
                existingUser.Email = user.Email;
                existingUser.Name = user.Name;
                existingUser.LastName = user.LastName;
                existingUser.Points = user.Points;

                // Actualizar la contraseña solo si se proporciona una nueva
                if (!string.IsNullOrEmpty(user.Password))
                {
                    var salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
                    existingUser.Password = passwordHash;
                }

                // Asignar manualmente el RoleId, si es el comportamiento deseado
                existingUser.RoleId = 2;

                await _context.SaveChangesAsync();
                return existingUser;
            }
            else
            {
                return BadRequest(new { ErrorMessage = "Invalid RUT or Email format." });
            }
        }

        // Delete user 
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var userToDelete = await _context.Users.FindAsync(id);

            if (userToDelete == null)
            {
                return NotFound(new { ErrorMessage = "Usuario no encontrado." });
            }

            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();
            
            return Ok();
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<User>> SearchUsers([FromQuery] string term)
        {
            // Lógica de búsqueda en la base de datos
            var users = _context.Users
                .Where(u => u.Rut.Contains(term) || u.Email.Contains(term))
                .ToList();
            
            if (users == null || !users.Any())
            {
                return NotFound("No se encontraron usuarios para el término de búsqueda proporcionado.");
            }

            return Ok(users);
        }
    }
}   