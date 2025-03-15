using Domain.Satelite.Handlers.Get;
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
        try
        {       
            var satelliteDTOs = await _mediator.Send(new GetSatelliteByIdPaginationRequest(name, page, count));
            return Ok(satelliteDTOs);
        }
        catch (Exception ex)
        {
            throw new Exception("GetSatelliteByIdSearchPagination catch an error");
        }

    }

}