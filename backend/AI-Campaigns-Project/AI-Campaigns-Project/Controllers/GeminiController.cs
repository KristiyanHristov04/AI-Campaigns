using AI_Campaigns_Project.DTOs;
using AI_Campaigns_Project.Enums;
using AI_Campaigns_Project.Services.Contracts;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
namespace AI_Campaigns_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeminiController : ControllerBase
    {
        private readonly IGeminiService geminiService;
        private readonly IFileService fileService;

        public GeminiController(
            IGeminiService geminiService,
            IFileService fileService)
        {
            this.geminiService = geminiService;
            this.fileService = fileService;
        }

        [HttpPost("generate-campaign")]
        public async Task<IActionResult> GenerateImageCampaignForABusiness(
            [FromForm] BusinessInputDetailsDto businessInputDetailsDto,
            IFormFileCollection? referenceImages)
        {
            BusinessOutputDetailsDto businessDetailsDto
                = await this.geminiService.GetBusinessDetailsAsync(businessInputDetailsDto);

            if (referenceImages != null)
            {
                foreach (IFormFile file in referenceImages)
                {
                    using MemoryStream ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    businessDetailsDto.ReferenceImages.Add((ms.ToArray(), file.ContentType));
                }
            }

            GeneratedAdInformationDto generatedAdInformationDto
                = await this.geminiService.GenerateAdImageAsync(businessDetailsDto);

            string pathToImage = Path.Combine(Directory.GetCurrentDirectory(), "GeneratedImages", generatedAdInformationDto.ImageName);
            byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(pathToImage);
            string base64Image = Convert.ToBase64String(imageBytes);

            this.fileService.DeleteImage(pathToImage);

            return Ok(new
            {
                description = generatedAdInformationDto.GeneratedAdCampaignDescription,
                image = $"data:image/png;base64,{base64Image}"
            });
        }
    }
}
