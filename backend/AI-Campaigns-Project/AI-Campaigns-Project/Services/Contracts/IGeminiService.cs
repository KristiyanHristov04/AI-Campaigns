using AI_Campaigns_Project.DTOs;
using AI_Campaigns_Project.Enums;

namespace AI_Campaigns_Project.Services.Contracts
{
    public interface IGeminiService
    {
        Task<BusinessOutputDetailsDto> GetBusinessDetailsAsync(BusinessInputDetailsDto businessInputDetailsDto);
        Task<GeneratedAdInformationDto> GenerateAdImageAsync(BusinessOutputDetailsDto businessDetailsDto);
    }
}
