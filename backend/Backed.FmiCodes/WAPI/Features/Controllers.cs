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

    [HttpGet]
    public async Task<IActionResult> GetSatelliteId()
    {
        var satellite = await _mediator.Send(new GetSatelliteByIdRequest { Id =1 });
        if(satellite == null)
            return BadRequest("Error occurred");
        
        return Ok(satellite);
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