using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using JobTracker.Api.Applications;
using JobTracker.Api.Tests.Infrastructure;

namespace JobTracker.Api.Tests.Applications;

[Collection(ApiCollection.Name)]
public class ApplicationsEndpointsTests(JobTrackerApiFactory factory)
{

    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    [Fact]
    public async Task GetAll_WithoutLogin_Returns401()
    {

        var client = factory.CreateClient();


        var response = await client.GetAsync("/api/applications");


        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Delete_OwnApplication_Returns204AndApplicationIsGone()
    {

        var client = await factory.CreateLoggedInClientAsync();
        var createResponse = await client.PostAsJsonAsync("/api/applications",
            new CreateJobApplicationRequest("Infobip", "Junior .NET", null));
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JobApplicationResponse>(Json);


        var deleteResponse = await client.DeleteAsync($"/api/applications/{created!.Id}");


        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        var getResponse = await client.GetAsync($"/api/applications/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
}