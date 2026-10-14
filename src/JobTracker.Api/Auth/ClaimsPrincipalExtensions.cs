using System.Security.Claims;

namespace JobTracker.Api.Auth;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
            throw new InvalidOperationException("Authenticated user has no NameIdentifier claim.");

        return userId;
    }
}