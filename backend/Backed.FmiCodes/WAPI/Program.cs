using System.Reflection;
using Domain.Satelite;
using Domain.Satelite.Handlers.Get;
using Domain.Satelite.Handlers.Get.FlaskGetDTO;
using Domain.Satellite.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DataBaseConnection");
builder.Services.AddDbContext<SatelliteDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddTransient<IRequestHandler<GetSatelliteByIdRequest, SatelliteDTO>, GetSatelliteByIdHandler>();

builder.Services.AddHttpClient();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(Assembly.Load("Domain")));

builder.Services.AddTransient<FlaskGetHandler>(); 
builder.Services.AddTransient<GetWillCollideHandler>(); 

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var configuration = builder.Configuration;
builder.Services.AddSingleton<IConfiguration>(configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");

app.MapControllers(); 

app.Run();