using System.Net;
using JobTracker.Api.Tests.Infrastructure;

namespace JobTracker.Api.Tests.Applications;

[Collection(ApiCollection.Name)]
public class ApplicationsEndpointsTests(JobTrackerApiFactory factory)
{
    [Fact]
    public async Task GetAll_WithoutLogin_Returns401()
    {
        // Arrange
        var client = factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/applications");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}