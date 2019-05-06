using Considerate.Hellolingo.Regulators;

namespace Considerate.Hellolingo.WebApp.Helpers.CustomValidationAttributed
{
  public class CleanUpUserLocationAttribute : CleanUpUserInputAttribute
  {
		public CleanUpUserLocationAttribute() : base(mustNotBeNull: false, 
			                                         cleanFunction: UserInputRegulator.CleanSignUpLocation) { }
	}
}
