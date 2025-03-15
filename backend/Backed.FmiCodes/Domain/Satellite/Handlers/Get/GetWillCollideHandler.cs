using Domain.Satellite.Dto;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace Domain.Satelite.Handlers.Get;

public class GetWillCollideHandler :IRequestHandler<GetWillCollideRequest, SatelliteDTO>
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    
    public GetWillCollideHandler(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }
    
    public async Task<SatelliteDTO> Handle(GetWillCollideRequest request, CancellationToken cancellationToken)
    {
        var baseUrl = _configuration["ConnectionStrings:flaskApiUrl"];
        var flaskApiUrl = $"{baseUrl}/{request.Id}";
        
        var response = await _httpClient.GetAsync(flaskApiUrl, cancellationToken);
        
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Flask API call failed with status code {response.StatusCode}");
        }
        
        //var jsonResponse = await response.Content.ReadAsStringAsync(cancellationToken);
        //var satellite = JsonConvert.DeserializeObject<SatelliteDTO>(jsonResponse);
        return null; //satellite;
    }
}