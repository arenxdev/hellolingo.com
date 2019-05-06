namespace MailBox {
	export class MessageValidator {

		// maxLength isn't used because we use the html maxlength attributes instead.
		// That requires less code to maintain and less localization

		private minLength = 40;
		private isMinLengthFailed=false;
		
		isEnabled = false;

		messageTextErrorMessage: string;
		messageTextRequired:string;
		
		constructor(private messageFormControler: IMessageFormController,
			private isThisInitMessage: boolean, private messageNotValidLabel) {
			this.messageTextRequired = messageNotValidLabel;
		}

		private get isMessageValid() {
			const isValidText = this.isThisInitMessage
				? this.includeMinLengthValidation()
				: this.messageFormControler.messageText.$valid;
			if (!isValidText) {
				let error = Object.keys(this.messageFormControler.messageText.$error)[0];
				if (error === "required")
					this.messageTextErrorMessage = this.messageTextRequired;
				if (this.isMinLengthFailed)
					this.messageTextErrorMessage = this.messageTextRequired;
			} else
				this.messageTextErrorMessage = undefined;

			return isValidText;
		};

		get isValid() {
			return this.isEnabled ? this.isMessageValid : true;
		};

		includeMinLengthValidation() {
			if (this.messageFormControler && this.messageFormControler.messageText) {
				const viewVal = this.messageFormControler.messageText.$viewValue as string;
				this.isMinLengthFailed = (!viewVal || viewVal.length < this.minLength);
				return this.messageFormControler.messageText.$valid && !this.isMinLengthFailed;
			}
			this.isMinLengthFailed = false;
			return true;
		}
	};
}