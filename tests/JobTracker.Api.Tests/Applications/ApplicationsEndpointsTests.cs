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
    [Fact]
    public async Task Delete_OtherUsersApplication_Returns404AndApplicationStillExists()
    {
        var client1 = await factory.CreateLoggedInClientAsync();
        var client2 = await factory.CreateLoggedInClientAsync();
        var createResponse = await client1.PostAsJsonAsync("/api/applications",
             new CreateJobApplicationRequest("Infobip", "Junior .NET", null));
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JobApplicationResponse>(Json);

        var deleteResponse = await client2.DeleteAsync($"/api/applications/{created!.Id}");

        Assert.Equal(HttpStatusCode.NotFound, deleteResponse.StatusCode);
        var response = await client1.GetAsync($"/api/applications/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    }
    [Fact]
    public async Task Create_MissingCompany_Returns400()
    {

        var client = await factory.CreateLoggedInClientAsync();


        var createResponse = await client.PostAsJsonAsync("/api/applications",
             new { position = "Junior .NET", url = (string?)null });

        Assert.Equal(HttpStatusCode.BadRequest, createResponse.StatusCode);
    }
    [Fact]
    public async Task ChangeStatus_ValidRequest_Returns204AndAddsHistoryEntry()
    {

        var client = await factory.CreateLoggedInClientAsync();
        var createResponse = await client.PostAsJsonAsync("/api/applications",
             new CreateJobApplicationRequest("Infobip", "Junior .NET", null));
        createResponse.EnsureSuccessStatusCode();
        var created = await createResponse.Content.ReadFromJsonAsync<JobApplicationResponse>(Json);

        var patchResponse = await client.PatchAsJsonAsync($"/api/applications/{created!.Id}/status",
        new ChangeStatusRequest(ApplicationStatus.Applied, "Poslao CV"), Json);



        Assert.Equal(HttpStatusCode.NoContent, patchResponse.StatusCode);
        var history = await client.GetFromJsonAsync<List<StatusChangeResponse>>(
        $"/api/applications/{created.Id}/history", Json);
        Assert.Equal(2, history!.Count);
        Assert.Equal(ApplicationStatus.Saved, history[0].FromStatus);
        Assert.Equal(ApplicationStatus.Applied, history[0].ToStatus);
        Assert.Equal("Poslao CV", history[0].Notes);
    }
}