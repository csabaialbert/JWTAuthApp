using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.Controllers; 
using API.Dtos;
using API.Models;
using System.Collections.Generic;

namespace JWTAUTH.API.Tests
{
   public class RolesControllerTests
{
    private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;
    private readonly Mock<UserManager<AppUser>> _mockUserManager;

    public RolesControllerTests()
    {
        // ARRANGE: Inicializálás
        // Mockoljuk a RoleManagert és a UserManagert
        _mockRoleManager = IdentityManagerMocks.GetMockRoleManager();
        _mockUserManager = IdentityManagerMocks.GetMockUserManager<AppUser>();
    }

    [Fact]
    public async Task CreateRole_RoleDoesNotExist_ReturnsOkStatus()
    {
        // ARRANGE: Előkészítés
        var createRoleDto = new CreateRoleDto { RoleName = "Tester" };

        // 1. Beállítjuk a RoleExistsAsync metódust, hogy HAMIS-at adjon vissza (azaz a szerepkör nem létezik)
        _mockRoleManager.Setup(rm => rm.RoleExistsAsync(createRoleDto.RoleName))
                        .ReturnsAsync(false);

        // 2. Beállítjuk a CreateAsync metódust, hogy SIKER-t adjon vissza
        _mockRoleManager.Setup(rm => rm.CreateAsync(It.IsAny<IdentityRole>()))
                        .ReturnsAsync(IdentityResult.Success);

        var controller = new RolesController(_mockRoleManager.Object, _mockUserManager.Object);

        // ACT: A metódus meghívása
        var result = await controller.CreateRole(createRoleDto);

        // ASSERT: Ellenőrzés
        // 1. Elvárjuk, hogy a válasz 200 OK legyen
        var okResult = Assert.IsType<OkObjectResult>(result);
        
        // 2. Ellenőrizzük, hogy a RoleExistsAsync metódust pontosan egyszer hívtuk meg
        _mockRoleManager.Verify(rm => rm.RoleExistsAsync("Tester"), Times.Once);

        // 3. Ellenőrizzük, hogy a CreateAsync metódust pontosan egyszer hívtuk meg
        _mockRoleManager.Verify(rm => rm.CreateAsync(It.IsAny<IdentityRole>()), Times.Once);
    }
    
    [Fact]
    public async Task CreateRole_RoleAlreadyExists_ReturnsBadRequest()
    {
        // ARRANGE: Előkészítés
        var createRoleDto = new CreateRoleDto { RoleName = "Admin" };

        // Beállítjuk a RoleExistsAsync metódust, hogy IGAZ-at adjon vissza (már létezik)
        _mockRoleManager.Setup(rm => rm.RoleExistsAsync(createRoleDto.RoleName))
                        .ReturnsAsync(true);

        var controller = new RolesController(_mockRoleManager.Object, _mockUserManager.Object);

        // ACT: A metódus meghívása
        var result = await controller.CreateRole(createRoleDto);

        // ASSERT: Ellenőrzés
        // Elvárjuk, hogy a válasz 400 Bad Request legyen
        Assert.IsType<BadRequestObjectResult>(result);

        // Ellenőrizzük, hogy a CreateAsync metódust SOHA nem hívtuk meg
        _mockRoleManager.Verify(rm => rm.CreateAsync(It.IsAny<IdentityRole>()), Times.Never);
    }
}
}