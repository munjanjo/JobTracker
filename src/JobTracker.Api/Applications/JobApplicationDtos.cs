namespace JobTracker.Api.Applications;

public record JobApplicationResponse(int Id, string Company, string Position, string? Url, ApplicationStatus Status, DateTimeOffset CreatedAt);
public record CreateJobApplicationRequest(string Company, string Position, string? Url);

public record ChangeStatusRequest(ApplicationStatus Status, string? Notes);

public record StatusChangeResponse(
    int Id, ApplicationStatus? FromStatus, ApplicationStatus ToStatus,
    DateTimeOffset ChangedAt, string? Notes);