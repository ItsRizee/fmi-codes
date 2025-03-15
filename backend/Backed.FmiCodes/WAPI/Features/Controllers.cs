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

        Console.WriteLine("Hellooooo="); 
        var satellite = await _mediator.Send(new GetSatelliteByIdRequest { Id =1 });
        if(satellite == null)
            return BadRequest("Error occurred");
        
        return Ok(satellite);
    }
}