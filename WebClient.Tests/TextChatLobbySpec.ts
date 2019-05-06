//module UnitTests {
//	describe("Text Chat Lobby", () => {
//		describe("Controller", () => {
//			beforeEach(angular.mock.module("app"));
//			it("Predefined menu items", () => {
//				const learnFrench = Languages.french.id;
//				const knowSpanish = Languages.spanish.id;
//				let userServiceMock = <Authentication.IUserService>{ getUser: () => { return { knows: knowSpanish, learns: learnFrench } } };
//				let lobbyController = new TextChatLobby.TextChatLobbyController(undefined, undefined, undefined, undefined, userServiceMock, undefined);
//				let prefferedMenuItems = lobbyController.getPreferredMenu(undefined);
//				expect(prefferedMenuItems.length).toBe(5);
//			});
//		});
//	});
//}