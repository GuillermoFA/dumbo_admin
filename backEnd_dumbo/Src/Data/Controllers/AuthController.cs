using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backEnd_dumbo.Src.DTO;
using backEnd_dumbo.Src.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backEnd_dumbo.Src.Data.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration; 

        public AuthController(DataContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        // ----/api/auth/register-----
        [HttpPost("registerAdmin")]
        public async Task<ActionResult<LoggedUserDto>> Register(RegisterClientDto registerClientDto)
        {
            var salt = BCrypt.Net.BCrypt.GenerateSalt(12);
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerClientDto.Password, salt);
            var user = new User()
            {
                Rut = registerClientDto.Rut,
                Email = registerClientDto.Email,
                Name = registerClientDto.Name,
                Password = passwordHash,
                RoleId = 1
            };
            var createdUser = (await _context.Users.AddAsync(user)).Entity;
            await _context.SaveChangesAsync();

            var token = CreateToken(createdUser);
            
            var loggedUsedDto = new LoggedUserDto()
            {
                Token = token,
                Email = user.Email,
                Name = user.Name
            };

            return loggedUsedDto;
        }

        // ---/api/auth/login-----
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginUserDto loginUserDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUserDto.Email);
            if (user is null) return BadRequest("Invalid Credentials");
            var result = BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.Password);
            if(!result) return BadRequest("Invalid Credentials");

            string token = CreateToken(user);

            var response = new 
            {
                token,
                user.Rut,
                user.Name,
                user.Email,
                user.Role,
                message = "Login Success"

            };

            return Ok(response);
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>(){
                new Claim("rut", "" + user.Rut),
                new Claim("name", "" + user.Name),
                new Claim("email", "" + user.Email),
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}