class FormInputsRegulator {
	private static firstNameStartRegExp = /^[\u0020\\-]+/;
	private static firstNameEndRegExp = /[\u0020\\-]+$/;
	private static lastNameStartTrimRegExp = /^-+/;
	private static lastNameEndTrimRegExp = /-+$/;
	private static lastNameRegExp = /^\.+/;
	private static locationStartRegExp = /^[\u0020\.\(\),'&\\-]+/;
	private static locationEndRegExp = /[\u0020\(,'&\\-]+$/;
	private static locationEndDotsRegExp = /\.{2,}$/;

    static cleanFirstName(nameString: string): string {
        if (nameString) {
            nameString = nameString.replace(FormInputsRegulator.firstNameStartRegExp, "")
                                   .replace(FormInputsRegulator.firstNameEndRegExp, "");
        }
        return nameString;
    }

    static cleanLastName(nameString: string): string {
        if (nameString) {
			nameString = nameString.trim()
				                   .replace(FormInputsRegulator.lastNameRegExp, "")
				                   .replace(FormInputsRegulator.lastNameStartTrimRegExp, "")
				                   .replace(FormInputsRegulator.lastNameEndTrimRegExp, "")
				                   .trim();
        }
        return nameString;
    }
	
    static cleanLocation(locationString: string): string {
        if (locationString) {
            locationString = locationString.trim()
				.replace(FormInputsRegulator.locationStartRegExp, "")
				.replace(FormInputsRegulator.locationEndRegExp, "")
				.replace(FormInputsRegulator.locationEndDotsRegExp, ".")
				.trim();
        }
        return locationString === "" ? undefined : locationString;
    }


}