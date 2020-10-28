using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("/api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController: ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repository, IMapper mapper,
                                IOptions<CloudinarySettings> cloudinarySettings)
        {
            _repository = repository;
            _mapper = mapper;
            _cloudinarySettings = cloudinarySettings;

            Account acc = new Account(
                _cloudinarySettings.Value.CloudName,
                _cloudinarySettings.Value.ApiKey,
                _cloudinarySettings.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("id", Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repository.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhoto(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repository.GetUser(userId);

            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                using(var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500)
                                                             .Height(500)
                                                             .Crop("fill")
                                                             .Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!userFromRepo.Photos.Any(p => p.IsMain))
                photo.IsMain = true;

            userFromRepo.Photos.Add(photo);

            if(await _repository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repository.GetUser(userId);

            if(!userFromRepo.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await _repository.GetPhoto(id);

            if(photo.IsMain)
                return BadRequest("This is already a Main photo");

            var mainPhoto = await _repository.GetMainPhotoForUser(userId);
            mainPhoto.IsMain = false;

            photo.IsMain = true;

            if(await _repository.SaveAll())
                return NoContent();

            return BadRequest("Could not set photo as Main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repository.GetUser(userId);

            if(!userFromRepo.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await _repository.GetPhoto(id);

            if(photo.IsMain)
                return BadRequest("You cannot delete your Main photo.");

            if(photo.PublicId != null)
            {
                var deletionParams = new DeletionParams(photo.PublicId);
                var result = _cloudinary.Destroy(deletionParams);

                if(result.Result == "ok"){
                    _repository.Delete(photo);
                }
            }
            
            if(photo.PublicId == null)
            {
                _repository.Delete(photo);
            }

            if(await _repository.SaveAll()){
                return Ok();
            }

            return BadRequest("Failed to delete the photo");
        }
    }
}