using Domain.Satelite.Handlers.Get;
using Domain.Satellite.Handlers.Get.GetDebries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Features;

[ApiController]
[Route("api/[controller]")]
public class Controllers : ControllerBase
{
    private readonly IMediator _mediator;

    public Controllers(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSatelliteId(int id)
    {
        try
        {
            var satellite = await _mediator.Send(new GetSatelliteByIdRequest { Id = id });
            return Ok(satellite);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("willCollide/{id}")]
    public async Task<IActionResult> WillCollide(int id)
    {
        try
        {
            var satellite = await _mediator.Send(new GetWillCollideRequest { Id = id });
            return Ok(satellite);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("GetSatelliteByIdPagination")]
    public async Task<IActionResult> GetSatelliteByIdPagination([FromQuery] string? name, [FromQuery]int page,[FromQuery] int count)
    {
            var satelliteDTOs = await _mediator.Send(new GetSatelliteByIdPaginationRequest(name, page, count));
            return Ok(satelliteDTOs);

    }

    [HttpPost("GenerateFile")]
    public async Task<IActionResult> GenerateFile([FromBody]int[] ids)
    {
        var file = await _mediator.Send(new GenerateFileRequest(ids)); 
        return file;
    }
    
    [HttpGet("getDebrie/{id}")]
    public async Task<IActionResult> GetDebrieId(int id)
    {
        try
        {
            var debrie = await _mediator.Send(new GetDebrieByIdRequest { Id = id });
            return Ok(debrie);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}