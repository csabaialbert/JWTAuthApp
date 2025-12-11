using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JWTAUTH.API.Tests
{
public static class IdentityManagerMocks
{
    // 1. UserManager Mockolása
    public static Mock<UserManager<TUser>> GetMockUserManager<TUser>(TUser userForFind = null) where TUser : class
    {
        var store = new Mock<IUserStore<TUser>>();
        var userManager = new Mock<UserManager<TUser>>(
            store.Object,
            new Mock<IOptions<IdentityOptions>>().Object,
            new Mock<IPasswordHasher<TUser>>().Object,
            new IUserValidator<TUser>[0],
            new IPasswordValidator<TUser>[0],
            new Mock<ILookupNormalizer>().Object,
            new Mock<IdentityErrorDescriber>().Object,
            new Mock<IServiceProvider>().Object,
            new Mock<ILogger<UserManager<TUser>>>().Object);

        // Alapértelmezett beállítások:

        // CreateAsync: A regisztráció teszteléséhez
        userManager.Setup(um => um.CreateAsync(It.IsAny<TUser>(), It.IsAny<string>()))
                   .ReturnsAsync(IdentityResult.Success);

        // AddToRoleAsync: A szerepkör hozzáadáshoz
        userManager.Setup(um => um.AddToRoleAsync(It.IsAny<TUser>(), It.IsAny<string>()))
                   .ReturnsAsync(IdentityResult.Success);

        // FindByEmailAsync: A Login teszteléséhez
        if (userForFind != null)
        {
             userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
                       .ReturnsAsync(userForFind);
        }
        else
        {
             userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
                       .ReturnsAsync((TUser)null);
        }

        // GetRolesAsync: A Token generáláshoz
        userManager.Setup(um => um.GetRolesAsync(It.IsAny<TUser>()))
                   .ReturnsAsync(new List<string> { "User" }); // Alapértelmezett szerepkör
        
        // FindByIdAsync: A GetDetails teszteléséhez
        userManager.Setup(um => um.FindByIdAsync(It.IsAny<string>()))
                   .ReturnsAsync(userForFind);

        return userManager;
    }

    // 2. RoleManager Mockolása (Egyszerű)
    public static Mock<RoleManager<IdentityRole>> GetMockRoleManager()
    {
        var store = new Mock<IRoleStore<IdentityRole>>();
        var roleManager = new Mock<RoleManager<IdentityRole>>(store.Object, null, null, null, null);
        return roleManager;
    }
}
}