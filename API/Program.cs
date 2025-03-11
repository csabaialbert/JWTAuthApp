using API.Data;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var JWTSetting = builder.Configuration.GetSection("JWTSetting");
// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options=>options.UseSqlite("Data Source=auth.db"));

builder.Services.AddIdentity<AppUser, IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters 
            {
                NameClaimType = "nameid",
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = JWTSetting["validIssuer"],
                ValidAudience = JWTSetting["validAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTSetting.GetSection("securityKey").Value!))
            };
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    // Log authentication failure
                    Console.WriteLine($"Authentication failed: {context.Exception.Message}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    return Task.CompletedTask;
                },
                OnTokenValidated = context =>
                {
                    // Log token validation
                    var user = context.Principal;
                    Console.WriteLine("Token validated successfully!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    foreach (var claim in user.Claims)
                    {
                        Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
                    }
                    return Task.CompletedTask;
                },
                OnChallenge = context =>
                {
                    // Log challenge (unauthorized access)
                    Console.WriteLine("Authentication challenge triggered!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    return Task.CompletedTask;
                }
            };
        });
        Console.WriteLine($"ValidIssuer: {JWTSetting["validIssuer"]}");
Console.WriteLine($"ValidAudience: {JWTSetting["validAudience"]}");
Console.WriteLine($"SecurityKey: {JWTSetting.GetSection("securityKey").Value}");

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c=>{
c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme{
    Description = @"JWT Authorization Example : 'Bearer fas43rsearw3dfsad'",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.ApiKey,
    Scheme = "Bearer"
});
c.AddSecurityRequirement(new OpenApiSecurityRequirement(){
  {new OpenApiSecurityScheme{
    
        Reference = new OpenApiReference{
            Type = ReferenceType.SecurityScheme,
            Id  = "Bearer"
        },
        Scheme = "Bearer",
        Name = "Authorization",
        In = ParameterLocation.Header,
    },
    new List<string>()
}});
}
);
builder.Services.AddLogging(options =>
{
    options.AddConsole();  // Logs to console
    options.AddDebug();    // Logs to debug output
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowAnyOrigin();
});
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated ?? false)
    {
        Console.WriteLine("User authenticated. Claims:");
        foreach (var claim in context.User.Claims)
        {
            Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
        }
    }
    else
    {
        Console.WriteLine("User is not authenticated.");
    }

    await next();
});
app.MapControllers();

app.Run();
