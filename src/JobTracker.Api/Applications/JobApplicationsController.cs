using JobTracker.Api.Data;
using JobTracker.Api.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace JobTracker.Api.Applications;

[ApiController]
[Route("api/applications")]
[Authorize]
public class JobApplicationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<JobApplicationResponse>>> GetAll(CancellationToken ct)
    {
        var items = await db.JobApplications
            .AsNoTracking()
            .Where(a => a.UserId == User.GetUserId())
            .OrderByDescending(a => a.CreatedAt)
            .Select(JobApplicationMappings.ToResponseExpression)
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobApplicationResponse>> GetById(int id, CancellationToken ct)
    {
        var item = await db.JobApplications
            .AsNoTracking()
            .Where(a => a.Id == id && a.UserId == User.GetUserId())
            .Select(JobApplicationMappings.ToResponseExpression)
            .FirstOrDefaultAsync(ct);

        return item is null ? NotFound() : Ok(item);

    }
    [HttpPost]
    public async Task<ActionResult<JobApplicationResponse>> Create(CreateJobApplicationRequest request, CancellationToken ct)
    {
        var entity = new JobApplication
        {
            Company = request.Company,
            Position = request.Position,
            Url = request.Url,
            UserId = User.GetUserId(),
            CreatedAt = DateTimeOffset.UtcNow
        };
        entity.StatusChanges.Add(new StatusChange
        {
            FromStatus = null,
            ToStatus = ApplicationStatus.Saved,
            ChangedAt = entity.CreatedAt,
        });
        db.JobApplications.Add(entity);
        await db.SaveChangesAsync(ct);

        var response = entity.ToResponse();

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, response);
    }
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> ChangeStatus(int id, ChangeStatusRequest request, CancellationToken ct)
    {
        var application = await db.JobApplications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == User.GetUserId(), ct);
        if (application is null)
        {
            return NotFound();
        }
        if (application.Status == request.Status)
        {
            return BadRequest("The application is already in the specified status.");
        }
        application.StatusChanges.Add(new StatusChange
        {
            FromStatus = application.Status,
            ToStatus = request.Status,
            ChangedAt = DateTimeOffset.UtcNow,
            Notes = request.Notes
        });
        application.Status = request.Status;
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
    [HttpGet("{id:int}/history")]
    public async Task<ActionResult<List<StatusChangeResponse>>> GetStatusHistory(int id, CancellationToken ct)
    {
        var application = await db.JobApplications
        .AsNoTracking()
        .Where(a => a.Id == id && a.UserId == User.GetUserId())
        .Select(a => new
        {
            a.Id,
            StatusChanges = a.StatusChanges
                .OrderByDescending(s => s.ChangedAt)
                .Select(s => new StatusChangeResponse(
                    s.Id, s.FromStatus, s.ToStatus, s.ChangedAt, s.Notes))
                .ToList()
        })
        .FirstOrDefaultAsync(ct);
        return application is null ? NotFound() : Ok(application.StatusChanges);
    }

}