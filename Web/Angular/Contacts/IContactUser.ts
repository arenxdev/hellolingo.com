namespace Contacts {
	export interface IContactUser {
		id: number;
		firstName: string;
		lastName: string;
		country: number;
		gender: Enums.Gender;
		age: number;
		knows: number;
		learns: number;
	}
}