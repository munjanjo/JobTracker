namespace JobTracker.Api.Applications;

public class JobApplication
{
    public int Id { get; set; }
    public required string Company { get; set; }
    public required string Position { get; set; }
    public string? Url { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public ApplicationStatus Status { get; set; }

    public List<StatusChange> StatusChanges { get; set; } = new();

}