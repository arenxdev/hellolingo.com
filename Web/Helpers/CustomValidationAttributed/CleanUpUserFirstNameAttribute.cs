using Considerate.Hellolingo.Regulators;

namespace Considerate.Hellolingo.WebApp.Helpers.CustomValidationAttributed
{
  public class CleanUpUserFirstNameAttribute : CleanUpUserInputAttribute
  {
    public CleanUpUserFirstNameAttribute():base(mustNotBeNull:true, 
		                                        cleanFunction:UserInputRegulator.CleanSignUpFirstName)
    {}
  }
}