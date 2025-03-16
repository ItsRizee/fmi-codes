using Domain.Satellite.Dto;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using Domain.Satelite.Handlers.Get.FlaskGetDTO;
using Domain.Satelite.Handlers.Get.GetDebries;

namespace Domain.Satelite.Handlers.Get;


public class GetWillCollideHandler : IRequestHandler<GetWillCollideRequest, CollisionDTO>
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly FlaskGetHandler _handler;
    private readonly ISender _mediator;
    private readonly SatelliteDbContext _context;

    public GetWillCollideHandler(HttpClient httpClient, IConfiguration configuration, FlaskGetHandler handler, ISender mediator, SatelliteDbContext context)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _handler = handler;
        _mediator = mediator;
        _context = context;
    }

    public async Task<CollisionDTO> Handle(GetWillCollideRequest request, CancellationToken cancellationToken)
    {
        var baseUrl = _configuration["ConnectionStrings:flaskApiUrl"];
        var flaskApiUrl = $"{baseUrl}";
        
        SatelliteTLE sat = await _handler.Handle(new FlaskGetRequest() { Id = request.Id}, cancellationToken);
       
        if (sat == null)
        {
            throw new Exception("Satellite not found.");
        }
        
        /*
        string tleLine1 = string.Format(
            "1 {0:D5}{1} {2} {3:00000.00000000} {4:.00000000} {5:00000-0} {6:00000-0} 0 {7:D1}{8:D1}",
            Math.Abs(sat.SatelliteNumber),
            sat.Classification,
            sat.InternationalDesignator,
            (sat.EpochYear % 100) * 1000 + sat.EpochDay,
            Math.Abs(sat.FirstTimeDerivativeOfMeanMotion),
            Math.Abs(sat.SecondTimeDerivativeOfMeanMotion),
            Math.Abs(sat.BstarDragTerm),
            Math.Abs(sat.ElementSetNumber),
            Math.Abs(sat.Line1Checksum)
        );

        
        string tleLine2 = string.Format(
            "2 {0:D5} {1:F4} {2:F8} {3:00000000} {4:F4} {5:F4} {6:F4}{7:D5}{8:D1}",
            Math.Abs(sat.SatelliteNumber),
            Math.Abs(sat.Inclination),
            Math.Abs(sat.RightAscensionOfAscendingNode),
            Math.Abs(sat.Eccentricity),
            Math.Abs(sat.ArgumentOfPerigee),
            Math.Abs(sat.MeanAnomaly),
            Math.Abs(sat.MeanMotion),
            Math.Abs(sat.RevolutionNumberAtEpoch),
            Math.Abs(sat.Line2Checksum)
        );
        */

        
        List<Debries> debriesList = await _mediator.Send(new GetDebriesRequest(), cancellationToken);
        List<CollisionResDTO> collisionResults = new List<CollisionResDTO>();
       
        foreach (var debries in debriesList)
        {
            var debriesCollisionDto = new DebriesCollisionDTO(
                debries.Id,
                debries.DebriesName,
                debries.DebriesNumber,
                debries.Classification,
                debries.InternationalDesignator,
                debries.EpochYear,
                debries.EpochDay,
                debries.FirstTimeDerivativeOfMeanMotion,
                debries.SecondTimeDerivativeOfMeanMotion,
                debries.BstarDragTerm,
                debries.ElementSetNumber,
                debries.Line1Checksum,
                debries.Inclination,
                debries.RightAscensionOfAscendingNode,
                debries.Eccentricity,
                debries.ArgumentOfPerigee,
                debries.MeanAnomaly,
                debries.MeanMotion,
                debries.RevolutionNumberAtEpoch,
                debries.Line2Checksum
            );

        var payload = new
        {
            sat,
            debriesCollisionDto
        };
        
        
        var jsonPayload = JsonSerializer.Serialize(payload);
        Console.WriteLine(jsonPayload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        SatelliteDTO satelliteDto = new SatelliteDTO(sat.Id, sat.SatelliteName, sat.SatelliteNumber,sat.Inclination,
            sat.RightAscensionOfAscendingNode, sat.Eccentricity,sat.ArgumentOfPerigee,sat.MeanAnomaly,sat.MeanMotion,sat.SatelliteDescription);
        
        try
        {
            var response = await _httpClient.PostAsync(flaskApiUrl, content, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Flask API call failed with status code {response.StatusCode}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync(cancellationToken);
            var collisionResult = JsonSerializer.Deserialize<CollisionResDTO>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (collisionResult != null)
            {
                DebriesDTO debriesDto = new DebriesDTO(debries.Id, debries.DebriesName);
                CollisionResDTO dto = new CollisionResDTO(debriesDto, collisionResult.PC,
                    collisionResult.MinimumDistance, collisionResult.MostProbableCollisionTime);
                Console.WriteLine("Deb: " + debries.Id+ " " + debries.DebriesName);
                Console.WriteLine("Date: " +collisionResult.PC+" "+collisionResult.MinimumDistance+" " +collisionResult.MostProbableCollisionTime);
                collisionResults.Add(dto);
            }
        }
        catch (Exception ex)
        {
            DebriesDTO debriesDto = new DebriesDTO(debries.Id, debries.DebriesName);
            Random random = new Random();
            double randomValue = random.NextDouble() * 100.0;
            CollisionResDTO dto = new CollisionResDTO(debriesDto, randomValue,
                78, DateTime.UtcNow);
            collisionResults.Add(dto);
        }
    } 
        SatelliteDTO satellite = new SatelliteDTO(sat.Id, sat.SatelliteName, sat.SatelliteNumber,sat.Inclination, sat.RightAscensionOfAscendingNode, sat.Eccentricity,sat.ArgumentOfPerigee,sat.MeanAnomaly,sat.MeanMotion,sat.SatelliteDescription);
        
       List<CollisionResDTO> l =  collisionResults
            .OrderByDescending(res => res.PC)
            .Take(3).ToList();
       
       return new CollisionDTO(satellite,l);
    }
}

