using System;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyNewWebApplication.Models;
using Npgsql;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Security.Claims;
using MyNewWebApplication.Data;
using System.Collections.Generic;

namespace MyNewWebApplication.Controllers
{

    [Route("api/")]

    [ApiController]

    public class ValuesController : ControllerBase
    {

        private ApplicationDbContext db = new ApplicationDbContext();

        private IConfiguration _config;

        public ValuesController(IConfiguration config)
        {
            _config = config;
        }
        [HttpOptions]
        [HttpPost]
        [Route("register")]
        public bool Register([FromBody] UserModel user)
        {
            bool result = false;
            var x = db.RegisteredUsers.Find(user.email);
            if (x == null)
            {
                PosgresUserRepository register = new PosgresUserRepository(db);
                var z = register.CreateUser(user);
                if (z)
                {
                    result = true;
                }
            }

            return result;
        }

        //aud,iss,exp,password,email

        [HttpOptions]
        [HttpPost]
        [Route("login")]
        public string Login([FromBody]LoginModel login)
        {

            string output = null;

            if (login.token != null)
            {
                string jwt = null;
                jwt = login.token;
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwt);
                var claims = token.Claims;
                Credentials[] check = new Credentials[5];
                int j = 0;
                foreach (var i in claims)
                {
                    if (j < 5)
                    {
                        check[j] = new Credentials(i.Type, i.Value);
                    }
                    j++;
                }
                var val = db.RegisteredUsers.Find(check[0].getCredentials()[1]);
                if (check[4].getCredentials()[1] == _config["Jwt:Audience"] && check[3].getCredentials()[1] == _config["Jwt:Issuer"] && val != null)
                {
                    output = "Token Verified";
                }
                return output;

            }

            else
            {
                bool x = false;
                try
                {
                    if (db.RegisteredUsers.Find(login.email).password.Equals(login.password))
                    {
                        x = true;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);     
                }
                if (x)
                {
                    string tokenString = BuildToken(db.RegisteredUsers.Find(login.email));
                    output = tokenString;

                }
     
                return output;
            }
        }

        private string BuildToken(UserModel user)
        {

            List<Claim> claim = new List<Claim> { new Claim("email", user.email), new Claim("password", user.password) };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
                claims: claim,
               expires: DateTime.Now.AddMinutes(30),
               signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }

}