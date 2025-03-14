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

    [HttpGet("id")]
    public async Task<IActionResult> GetSatelliteId(int id)
    {
        var satellite = await _mediator.Send(new GetSatelliteByIdRequest { Id = id });
        
        return Ok(satellite);
    }
}