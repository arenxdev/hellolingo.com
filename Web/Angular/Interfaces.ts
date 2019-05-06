interface IApp extends ng.IModule {
}

// =============== Global ===============

interface ILanguage {
	id: number;
	culture: string;
	name: string;
	text: string;
	tier:number;
}

interface ICountry {
	id: number;
	text: string;
	displayOrder?: number; //Those with positive numbers (see below) will appear at top in order.
}

interface IMonth {
	id: number;
	text: string;
}

// =============== Accessors ===============
// The accessor patterns facilitates calling directive methods from a parent scope

interface IAccessorModel {
	accessor: Object;
}

interface IAccessorScope extends ng.IScope, IAccessorModel {
}

interface IAccessorDirective extends ng.IDirective {
	scope: IAccessorModel
}

// =============== User ===============

interface IBaseUser {
	firstName: FirstName;
	lastName: LastName;
	gender: Enums.Gender;
	country: number;
	learns: LangId; learns2?: LangId; learns3?: LangId;
	knows: LangId; knows2?: LangId; knows3?: LangId;
}

interface IIdentifiableUser {
	id: UserId;
}

interface IUserPersonalData {
	email: string;
	birthMonth: number;
	birthYear: number;
	lookToLearnWithTextChat: boolean;
	lookToLearnWithVoiceChat: boolean;
	lookToLearnWithGames: boolean;
	lookToLearnWithMore: boolean;
	wantsToHelpHellolingo: boolean;
}

interface IUserExtendedData {
	isSharedTalkMember ?: boolean;
	isLivemochaMember ?: boolean;
	isSharedLingoMember ?: boolean;
	introduction ?: string;
	location: string;
}

interface ISignUpUser extends IBaseUser, IUserPersonalData, IUserExtendedData {
	password: string;
}

interface ILightUser extends IBaseUser, IIdentifiableUser {
	age: number
}

interface IUser extends ILightUser, IUserExtendedData {
	isPinned: boolean
}

interface IAuthUser extends IUser, IUserPersonalData {
	isEmailConfirmed: boolean;
	isNoPrivateChat: boolean;
}


// =============== Text Chat ===============

interface ITextChatUser extends IUser {
	isSelf           : boolean;
	roomTypingIn     : RoomId;
	isPrivatePartner : boolean;
}

interface IChatRequest {
	user: ITextChatUser;
	trackerStatusId: number;
	url:string;
}

interface IHubManagedAction<T> {
	orderId: number;
	message: IHubAction<T>;
}

interface IHubAction<T> {
	method: T;
	args: any[];
}

interface ITextChatHubServer {
	ack(orderId: Number);
	postTo(roomId: RoomId, message: string);
	setTypingActivityIn(roomId: RoomId);
	joinRoom(roomId: RoomId);
	leaveRoom(roomId: RoomId);
	requestAudioCall(roomId: RoomId);
	declineAudioCall(roomId: RoomId, reason: string);
	cancelAudioCall(roomId: RoomId, reason: string);
	hangoutAudioCall(roomId: RoomId);
}

interface ITextChatMessage {
	roomId?: RoomId;
	origin: MessageOrigin,
	userId:UserId;
	firstName: FirstName;
	lastName: LastName;
	htmlText?: string;
	text?: string;
	lastSeen?: boolean; // Define whether this is last message we know the user has seen.
}

interface ITextChatTracker {
	partner: TextChatUser;
	statusId: number;
	statusAt: String;
}

// =============== Named Types ===============

type RoomId = string;
type UserId = number;
type FirstName = string;
type LastName = string;
type LangId = number;
