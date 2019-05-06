using Considerate.Hellolingo.Regulators;

namespace Considerate.Hellolingo.WebApp.Helpers.CustomValidationAttributed
{
  public class CleanUpUserLastNameAttribute : CleanUpUserInputAttribute
  {
    public CleanUpUserLastNameAttribute():base(mustNotBeNull:true, 
		                                       cleanFunction:UserInputRegulator.CleanSignUpLastName)
    {
    }
  }
}