using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(maximumLength:8, MinimumLength = 4, ErrorMessage = "Password must be between 4 and 8 characters.")]
        public string Password { get; set; }
    }
}