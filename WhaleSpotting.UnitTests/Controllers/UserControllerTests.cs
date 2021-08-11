﻿using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using WhaleSpotting.Controllers;
using WhaleSpotting.Models.DbModels;
using WhaleSpotting.Models.ResponseModels;
using Xunit;

namespace WhaleSpotting.UnitTests.Controllers
{
    public class UserControllerTests
    {
        private readonly SignInManager<UserDbModel> _signInManager = A.Fake<SignInManager<UserDbModel>>();
        private readonly UserManager<UserDbModel> _userManager = A.Fake<UserManager<UserDbModel>>();
        private readonly RoleManager<IdentityRole> _roleManager = A.Fake<RoleManager<IdentityRole>>();
        private readonly UserController _underTest;

        public UserControllerTests()
        {
            _underTest = new UserController(_roleManager, _signInManager, _userManager);
        }

        [Fact]
        public async void GetCurrentUser_Called_ReturnsUserResponse()
        {
            // Arrange
            var userDbModel = new UserDbModel
            {
                UserName = "TestUser"
            };

            A.CallTo(() => _userManager.GetUserAsync(A<ClaimsPrincipal>.Ignored))
                .Returns(userDbModel);

            // Act
            var response = await _underTest.GetCurrentUser();

            // Assert
            response.Should().BeOfType<UserResponseModel>();
            response.Username.Should().Be("TestUser");
        }
    }
}