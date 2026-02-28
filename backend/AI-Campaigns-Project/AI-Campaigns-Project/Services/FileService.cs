using AI_Campaigns_Project.Services.Contracts;

namespace AI_Campaigns_Project.Services
{
    public class FileService : IFileService
    {
        public void DeleteImage(string pathToImage)
        {
            if (File.Exists(pathToImage))
            {
                File.Delete(pathToImage);
            }
        }
    }
}
