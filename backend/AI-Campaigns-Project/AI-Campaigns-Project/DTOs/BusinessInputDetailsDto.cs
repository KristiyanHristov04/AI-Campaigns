using AI_Campaigns_Project.Enums;

namespace AI_Campaigns_Project.DTOs
{
    public class BusinessInputDetailsDto
    {
        public string Url { get; set; } = null!;
        public CountryAdLanguage CountryAdLanguage { get; set; }
        public ImageType ImageType { get; set; }
        public ImageAspectRatio ImageAspectRatio { get; set; }
    }
}
