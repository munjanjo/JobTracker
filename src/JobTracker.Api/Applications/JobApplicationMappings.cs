using System.Linq.Expressions;

namespace JobTracker.Api.Applications;

public static class JobApplicationMappings
{
    public static readonly Expression<Func<JobApplication, JobApplicationResponse>> ToResponseExpression =
        a => new JobApplicationResponse(a.Id, a.Company, a.Position, a.Url, a.Status, a.CreatedAt);

    private static readonly Func<JobApplication, JobApplicationResponse> ToResponseFunc =
        ToResponseExpression.Compile();

    public static JobApplicationResponse ToResponse(this JobApplication application) =>
        ToResponseFunc(application);
}