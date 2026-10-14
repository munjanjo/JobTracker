using System.Security.Claims;
using JobTracker.Api.Auth;

namespace JobTracker.Api.Tests.Auth;

public class ClaimsPrincipalExtensionsTests
{
    [Fact]
    public void GetUserId_WhenNameIdentiferClaimExists_ReturnsItsValue()
    {
        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, "user-123")],
            authenticationType: "Test");
        var user = new ClaimsPrincipal(identity);


        var userId = user.GetUserId();

        Assert.Equal("user-123", userId);
    }
    [Fact]

    public void GetUserId_WhenNameIdentifierClaimIsMissing_ThrowsInvalidOperationException()
    {
        // Arrange
        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.Email, "ivo@test.com")],
            authenticationType: "Test");
        var user = new ClaimsPrincipal(identity);

        // Act + Assert
        Assert.Throws<InvalidOperationException>(() => user.GetUserId());
    }

    [Fact]
    public void GetUserId_WhenNameIdentifierClaimIsEmpty_ThrowsInvalidOperationException()
    {
        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, "")],
            authenticationType: "Test");
        var user = new ClaimsPrincipal(identity);

        Assert.Throws<InvalidOperationException>(() => user.GetUserId());
    }

}