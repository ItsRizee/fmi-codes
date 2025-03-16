namespace Domain.Satellite.Dto;

public class DebriesDTO
{
    public int Id { get; set; }
    public string Name { get; set; }

    public DebriesDTO(int id, string name)
    {
        Id = id;
        Name = name;
    }
}