using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Considerate.Hellolingo.WebApp.Helpers.CustomValidationAttributed
{
	public abstract class CleanUpUserInputAttribute : ValidationAttribute
	{
		private readonly Func<string, string> _func;
		private readonly bool _mustNotBeNull;

		protected CleanUpUserInputAttribute(bool mustNotBeNull, Func<string,string> cleanFunction )
		{
			_mustNotBeNull = mustNotBeNull;
			_func = cleanFunction;
		}

		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			if(value == null)
			{
				return _mustNotBeNull ? new ValidationResult(FormatErrorMessage(validationContext.DisplayName)) : ValidationResult.Success;
			}
			Type valueType = value.GetType();
			if(valueType != typeof(string))
			{
				return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
			}
			string stringValue = (string)value;
			string cleanedValue = _func(stringValue);
			if(cleanedValue == null && _mustNotBeNull)
			{
				return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
			}
			PropertyInfo firstNameProperty = validationContext.ObjectType.GetProperty(validationContext.MemberName);
			firstNameProperty.SetValue(validationContext.ObjectInstance, cleanedValue);
			return ValidationResult.Success;
		}
	}
}