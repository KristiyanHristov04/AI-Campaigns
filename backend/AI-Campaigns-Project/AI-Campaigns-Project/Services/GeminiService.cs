using AI_Campaigns_Project.DTOs;
using AI_Campaigns_Project.Enums;
using Google.GenAI.Types;
using Google.GenAI;
using AI_Campaigns_Project.Services.Contracts;
using System;

namespace AI_Campaigns_Project.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly Dictionary<ImageType, string> imageTypes = new Dictionary<ImageType, string>()
        {
            {
                ImageType.Normal,
                @"Create a modern hyperrealistic, eye-catching social media post image summarizing the 
                business and its services with bold typography, clean layout, and professional visuals. 
                Make it ready to upload to Instagram or Facebook. 
                Keep text on the image based on the language provided by the user. 
                [IMPORTANT] **If using logo or products make sure they are looking exactly the same as the original.**"
            },
            {
                ImageType.HyperRealistic, @"Create a hyperrealistic, ultra-premium 4K social media post 
                (Instagram/Facebook ready) that visually represents the business and its core services. 
                The design must feel like it was created by a top-tier professional designer —
                clean, luxurious, modern,  and visually striking.

                Use bold but minimal typography (very little text), strong hierarchy, perfect spacing, 
                and a high-end aesthetic. Focus on realism, cinematic lighting, sharp details, depth, 
                subtle shadows, and refined composition.  Full HD / 4K quality, crisp, polished, 
                and scroll-stopping.

                Text on the image must be in the language provided by the user.
                [IMPORTANT] **If using logo or products make sure they are looking exactly the same as the original.**
                The final result must look premium, sophisticated, and ready for immediate upload 
                — no clutter, no generic template feel."
            }
        };

        private readonly Dictionary<ImageAspectRatio, string> imageAspectRatios = new Dictionary<ImageAspectRatio, string>()
        {
            { ImageAspectRatio.Square, "1:1" },
            { ImageAspectRatio.Portrait, "4:5" },
            { ImageAspectRatio.Vertical, "9:16" },
            { ImageAspectRatio.Landscape, "16:9" },
        };

        public async Task<BusinessOutputDetailsDto> GetBusinessDetailsAsync(BusinessInputDetailsDto businessInputDetailsDto)
        {
            string prompt = @$"Analyze the website at {businessInputDetailsDto.Url}. 
                            Identify the business type and the main services they offer.
                            Keep website, products, and services names in the output.
                            The output should be in the following language: {businessInputDetailsDto.CountryAdLanguage}";



            Client client = new Client();

            GenerateContentConfig config = new GenerateContentConfig
            {
                Tools = [new Tool { GoogleSearch = new GoogleSearch() }]
            };

            GenerateContentResponse response = await client.Models.GenerateContentAsync(
                model: "gemini-2.5-flash", contents: prompt, config: config
            );

            string? result = response?.Candidates?[0].Content?.Parts?[0].Text;

            if (result is null)
            {
                throw new Exception("No text in response");
            }

            return new BusinessOutputDetailsDto()
            {
                ImageType = businessInputDetailsDto.ImageType,
                Output = result,
                ImageAspectRatio = businessInputDetailsDto.ImageAspectRatio,
                CountryAdLanguage = businessInputDetailsDto.CountryAdLanguage
            };
        }

        public async Task<GeneratedAdInformationDto> GenerateAdImageAsync(BusinessOutputDetailsDto businessDetailsDto)
        {
            string prompt = @$"{businessDetailsDto.Output}

                        {imageTypes[businessDetailsDto.ImageType]}

                        The text/font on the image should be in the following language: {businessDetailsDto.CountryAdLanguage}";

            Client client = new Client();

            var config = new GenerateContentConfig
            {
                ResponseModalities = ["IMAGE", "TEXT"],
                Tools = [new Tool { GoogleSearch = new GoogleSearch() }],
                ImageConfig = new ImageConfig()
                {
                    AspectRatio = imageAspectRatios[businessDetailsDto.ImageAspectRatio]
                }
            };

            GenerateContentResponse response;

            if (businessDetailsDto.ReferenceImages.Count > 0)
            {
                var requestParts = new List<Part> { new Part { Text = prompt } };

                foreach ((byte[] data, string mimeType) in businessDetailsDto.ReferenceImages)
                {
                    requestParts.Add(new Part
                    {
                        InlineData = new Blob { MimeType = mimeType, Data = data }
                    });
                }

                var content = new Content { Role = "user", Parts = requestParts };

                response = await client.Models.GenerateContentAsync(
                    model: "gemini-3.1-flash-image-preview", contents: content, config: config
                );
            }
            else
            {
                response = await client.Models.GenerateContentAsync(
                    model: "gemini-3.1-flash-image-preview", contents: prompt, config: config
                );
            }

            List<Part>? parts = response?.Candidates?[0].Content?.Parts;
            if (parts is null)
            {
                throw new Exception("No parts in response");
            }

            Part? imagePart = parts.FirstOrDefault(p => p.InlineData != null);
            if (imagePart?.InlineData?.Data is null)
            {
                var debugText = string.Join("\n", parts.Select(p => p.Text ?? "[no text]"));
                throw new Exception($"No image data found. Parts received:\n{debugText}");
            }

            string folder = Path.Combine(Directory.GetCurrentDirectory(), "GeneratedImages");
            Directory.CreateDirectory(folder);

            string fileName = $"{Guid.NewGuid()}.png";
            string filePath = Path.Combine(folder, fileName);

            await System.IO.File.WriteAllBytesAsync(filePath, imagePart.InlineData.Data);

            return new GeneratedAdInformationDto()
            {
                ImageName = fileName,
                GeneratedAdCampaignDescription = prompt
            };
        }
    }
}
