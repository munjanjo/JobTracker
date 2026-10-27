using System.Net.Http.Json;

namespace JobTracker.Api.Tests.Infrastructure;

public static class AuthHelper
{
    public static async Task<HttpClient> CreateLoggedInClientAsync(this JobTrackerApiFactory factory)
    {
        var client = factory.CreateClient();
        var email = $"user-{Guid.NewGuid()}@test.com";
        const string password = "Test123!";


        var register = await client.PostAsJsonAsync("/api/auth/register", new { email, password });
        register.EnsureSuccessStatusCode();
        var login = await client.PostAsJsonAsync("/api/auth/login?useCookies=true", new { email, password });
        login.EnsureSuccessStatusCode();
        return client;
    }
}