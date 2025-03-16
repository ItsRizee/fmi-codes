using Domain.Satellite.Dto;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using Domain.Satelite.Handlers.Get.FlaskGetDTO;
using Domain.Satelite.Handlers.Get.GetDebries;

namespace Domain.Satelite.Handlers.Get;


public class GetWillCollideHandler : IRequestHandler<GetWillCollideRequest, List<CollisionResDTO>>
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly FlaskGetHandler _handler;
    private readonly ISender _mediator;

    public GetWillCollideHandler(HttpClient httpClient, IConfiguration configuration, FlaskGetHandler handler, ISender mediator)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _handler = handler;
        _mediator = mediator;
    }

    public async Task<List<CollisionResDTO>> Handle(GetWillCollideRequest request, CancellationToken cancellationToken)
    {
        var baseUrl = _configuration["ConnectionStrings:flaskApiUrl"];
        var flaskApiUrl = $"{baseUrl}";
        
        SatelliteTLE sat = await _handler.Handle(new FlaskGetRequest() { Id = request.Id}, cancellationToken);
       
        if (sat == null)
        {
            throw new Exception("Satellite not found.");
        }
        
        string tleLine1 = string.Format(
            "1 {0:D5}{1} {2} {3:00000.00000000}  {4:+0.00000000}  {5:00000-0} {6:00000-0} {7:D1} {8:D1}",
            sat.SatelliteNumber,
            sat.Classification,
            sat.InternationalDesignator,
            sat.EpochYear % 100 + sat.EpochDay / 1000.0, 
            sat.FirstTimeDerivativeOfMeanMotion,
            sat.SecondTimeDerivativeOfMeanMotion,
            sat.BstarDragTerm,
            sat.ElementSetNumber,
            sat.Line1Checksum + sat.Line2Checksum
        );
        
        string tleLine2 = string.Format(
            "2 {0:D5} {1:8.4f} {2:8.4f} {3:7.5f} {4:8.4f} {5:8.4f} {6:11.8f} {7:D6}",
            sat.SatelliteNumber,
            sat.Inclination,
            sat.RightAscensionOfAscendingNode,
            sat.Eccentricity, 
            sat.ArgumentOfPerigee,
            sat.MeanAnomaly,
            sat.MeanMotion,
            sat.RevolutionNumberAtEpoch
        );
        
        List<Debries> debriesList = await _mediator.Send(new GetDebriesRequest(), cancellationToken);
        List<CollisionResDTO> collisionResults = new List<CollisionResDTO>();
       
        foreach (var debries in debriesList)
        {
        string tleLine1Debries = string.Format(
            "1 {0:D5}{1} {2} {3:00000.00000000}  {4:+0.00000000}  {5:00000-0} {6:00000-0} {7:D1} {8:D1}",
            debries.DebriesNumber,
            debries.Classification,
            debries.InternationalDesignator,
            debries.EpochYear % 100 + debries.EpochDay / 1000.0,
            debries.FirstTimeDerivativeOfMeanMotion,
            debries.SecondTimeDerivativeOfMeanMotion,
            debries.BstarDragTerm,
            debries.ElementSetNumber,
            debries.Line1Checksum + debries.Line2Checksum
        );
        
        string tleLine2Debries = string.Format(
            "2 {0:D5} {1:8.4f} {2:8.4f} {3:0.0000000} {4:8.4f} {5:8.4f} {6:11.8f} {7:D6}",
            debries.DebriesNumber,                         
            debries.Inclination,                          
            debries.RightAscensionOfAscendingNode,        
            debries.Eccentricity,                        
            debries.ArgumentOfPerigee,                    
            debries.MeanAnomaly,                          
            debries.MeanMotion,                           
            debries.RevolutionNumberAtEpoch               
        );
        
        var payload = new
        {
            tleLine1,
            tleLine2,
            tleLine1Debries,
            tleLine2Debries
        };

        var jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

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
                CollisionResDTO dto = new CollisionResDTO(debries.Id, collisionResult.PC,
                    collisionResult.MinimumDistance, collisionResult.MostProbableCollisionTime);
                collisionResults.Add(dto);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error calling Flask API for debries {debries.DebriesNumber}: {ex.Message}");
        }
    }

       return collisionResults
            .OrderByDescending(res => res.PC)
            .Take(3).ToList();
    }
}

