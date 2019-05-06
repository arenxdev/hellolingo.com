/// <reference path="../../References.d.ts" />

module Authentication {

  export interface ISignUpScope extends ng.IScope {
      loading: boolean;

      // Profile/Sign Up data
      user: ISignUpUser; 
      
      // Form Controllers
      profileForm: IProfileFormController;
      signUpForm: ISignUpFormController;

      // Resources
      months: IMonth[];
      years: number[];
      languages: Languages.ILanguage[];
      countries: ICountry[];

      // Form Actions
      setLearns: (langs: number[]) => void;
      setKnows: (langs: number[]) => void;
      setCountry: (countryId: number) => void;
      setGenderAsMale: () => void;
      setGenderAsFemale: () => void;
      setMonth: (month: number) => void;
      submitProfile: () => void;
      signUp: () => void;

      // Model for Form Selections
      selectedMonth: string;
      selectedCountry: ICountry;

      // Form Validation
      profileFormValidation: ProfileFormValidation;
      signUpFormValidation: SignUpFormValidation;
      removeIdenticalNames(): void;
      cleanFirstName(): void;
      cleanLastName (): void;
      cleanLocation() : void;
	  signUpClientFailedMessage: string;

      // Handle failure to sign up on server
      signUpFailedOnServer: boolean;
      signUpServerFailedMessage: string;
	  
    }
}