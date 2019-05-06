using System.ComponentModel.DataAnnotations;

namespace Considerate.Hellolingo.WebApp.Models
{
  public class LoginRequestModel
  {
    [Required]
    public string UserName { get; set; }

    [Required]  
    public string Password { get; set; }
  }
}