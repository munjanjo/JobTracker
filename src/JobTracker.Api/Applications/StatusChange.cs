namespace JobTracker.Api.Applications;

public class StatusChange
{
    public int Id { get; set; }
    public int JobApplicationId { get; set; }
    public ApplicationStatus? FromStatus { get; set; }
    public ApplicationStatus ToStatus { get; set; }
    public DateTimeOffset ChangedAt { get; set; }
    public string? Notes { get; set; }
}