using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace MyNewWebApplication
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
          
            Configuration = configuration;
        
        }

        public IConfiguration Configuration { get; }

       
        public void ConfigureServices(IServiceCollection services)
        {

            //services.AddEntityFrameworkNpgsql().AddDbContext<MyWebApiContext>(opt => opt.UseNpgsql(Configuration.GetConnectionString("MyWebApiConnection")));

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                builder =>
                {
                    builder.WithOrigins("*")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                });
            });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }



      
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
            
                app.UseHsts();
            }
            app.UseCors("AllowAll");


            app.UseHttpsRedirection();

            app.UseMvc();

        }
    }
}
