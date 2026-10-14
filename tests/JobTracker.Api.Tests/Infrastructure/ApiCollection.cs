namespace JobTracker.Api.Tests.Infrastructure;

[CollectionDefinition(Name)]
public class ApiCollection : ICollectionFixture<JobTrackerApiFactory>
{
    public const string Name = "Api";
}