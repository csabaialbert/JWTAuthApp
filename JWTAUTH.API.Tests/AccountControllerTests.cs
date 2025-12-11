using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using API.Controllers; 
using API.Dtos;
using API.Models;
using System.Collections.Generic;

namespace JWTAUTH.API.Tests
{
    public class AccountControllerTests
{
    private readonly Mock<UserManager<AppUser>> _mockUserManager;
    private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;
    private readonly Mock<IConfiguration> _mockConfiguration;

    public AccountControllerTests()
    {
        // 1. ARRANGE: Inicializálás
        // Mockoljuk a UserManagert (ezek a függőségek)
        _mockUserManager = IdentityManagerMocks.GetMockUserManager<AppUser>();
        _mockRoleManager = IdentityManagerMocks.GetMockRoleManager();

        // Mockoljuk a Configuration-t (a JWT kulcs miatt)
        _mockConfiguration = new Mock<IConfiguration>();
        _mockConfiguration.Setup(c => c.GetSection(It.IsAny<string>()).GetSection(It.IsAny<string>()).Value).Returns("TestKey");
    }

    [Fact]
    public async Task Register_ValidData_ReturnsOkStatus()
    {
        // ARRANGE: Teszt adatok előkészítése
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            FullName = "Test User",
            Password = "SecurePassword123"
        };
        
        // A UserManager.CreateAsync-t beállítjuk, hogy sikert adjon vissza
        _mockUserManager.Setup(um => um.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
                        .ReturnsAsync(IdentityResult.Success);

        var controller = new AccountController(_mockUserManager.Object, _mockRoleManager.Object, _mockConfiguration.Object);

        // ACT: A metódus meghívása
        var result = await controller.Register(registerDto);

        // ASSERT: Ellenőrzés
        // 1. Elvárjuk, hogy a válasz 200 OK legyen
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        // 2. Elvárjuk, hogy a visszatérési DTO IsSuccess = true legyen
        var authResponse = Assert.IsType<AuthResponseDto>(okResult.Value);
        Assert.True(authResponse.IsSuccess);
        
        // 3. Ellenőrizzük, hogy meghívtuk-e a CreateAsync metódust pontosan egyszer
        _mockUserManager.Verify(um => um.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()), Times.Once);
        
        // 4. Ellenőrizzük, hogy a default "User" szerepkör hozzá lett-e adva
        _mockUserManager.Verify(um => um.AddToRoleAsync(It.IsAny<AppUser>(), "User"), Times.Once);
    }
}
}