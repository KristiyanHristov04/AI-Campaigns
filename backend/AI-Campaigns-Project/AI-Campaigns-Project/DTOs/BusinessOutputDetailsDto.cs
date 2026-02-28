using AI_Campaigns_Project.Enums;

namespace AI_Campaigns_Project.DTOs
{
    public class BusinessOutputDetailsDto
    {
        public string Output { get; set; } = null!;
        public CountryAdLanguage CountryAdLanguage { get; set; }
        public ImageType ImageType { get; set; }
        public ImageAspectRatio ImageAspectRatio { get; set; }
        public List<(byte[] Data, string MimeType)> ReferenceImages { get; set; } = [];
    }
}
