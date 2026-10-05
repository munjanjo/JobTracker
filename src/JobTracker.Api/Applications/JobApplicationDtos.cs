namespace JobTracker.Api.Applications;

public record JobApplicationResponse(int Id, string Company, string Position, string? Url, DateTimeOffset CreatedAt);
public record CreateJobApplicationRequest(string Company, string Position, string? Url);
