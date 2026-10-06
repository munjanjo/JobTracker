using JobTracker.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Applications;

[ApiController]
[Route("api/applications")]
public class JobApplicationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<JobApplicationResponse>>> GetAll(CancellationToken ct)
    {
        var items = await db.JobApplications
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new JobApplicationResponse(a.Id, a.Company, a.Position, a.Url, a.CreatedAt))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobApplicationResponse>> GetById(int id, CancellationToken ct)
    {
        var item = await db.JobApplications
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new JobApplicationResponse(a.Id, a.Company, a.Position, a.Url, a.CreatedAt))
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
            CreatedAt = DateTimeOffset.UtcNow
        };

        db.JobApplications.Add(entity);
        await db.SaveChangesAsync(ct);

        var response = new JobApplicationResponse(
            entity.Id, entity.Company, entity.Position, entity.Url, entity.CreatedAt);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, response);
    }

}