module UnitTests {
	describe("message formating", () => {
		describe("bold",
		() => {
			it("text1", () => {
				const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
				const bold = accessor.formatBold("hello *Andriy*");
				expect(bold).toEqual("hello <span class='message-bold'>Andriy</span>");
			});

			it("text2", () => {
				const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
				const bold = accessor.formatBold("hello *Andriy* hello");
				expect(bold).toEqual("hello <span class='message-bold'>Andriy</span> hello");
			});

			it("text3", () => {
				const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
				const bold = accessor.formatBold("hello *Andriy* hello *Julia*");
				expect(bold).toEqual("hello <span class='message-bold'>Andriy</span> hello <span class='message-bold'>Julia</span>");
			});

			it("text4", () => {
				const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
				const bold = accessor.formatBold("*hello *Andriy* hello *Julia*");
				expect(bold).toEqual("*hello <span class='message-bold'>Andriy</span> hello <span class='message-bold'>Julia</span>");
			});
			it("text5", () => {
				const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
				const bold = accessor.formatBold("Elle est aidé*e*");
				expect(bold).toEqual("Elle est aidé<span class='message-bold'>e</span>");
			});
		});

		describe("underline",
			() => {
				it("text1",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatUnderline("hello _Andriy_");
						expect(bold).toEqual("hello <span class='message-underline'>Andriy</span>");
					});

				it("text2",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatUnderline("hello _Andriy_ hello");
						expect(bold).toEqual("hello <span class='message-underline'>Andriy</span> hello");
					});

				it("text3",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatUnderline("hello _Andriy_ hello _Julia_");
						expect(bold)
							.toEqual("hello <span class='message-underline'>Andriy</span> hello <span class='message-underline'>Julia</span>");
					});

				it("text4",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatUnderline("_hello _Andriy_ hello _Julia_");
						expect(bold)
							.toEqual("_hello <span class='message-underline'>Andriy</span> hello <span class='message-underline'>Julia</span>");
					});
			});

		describe("strike-through",
			() => {
				it("text1",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatStrikethrough("hello ~Andriy~");
						expect(bold).toEqual("hello <span class='message-strikethrough'>Andriy</span>");
					});

				it("text2",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatStrikethrough("hello ~Andriy~ hello");
						expect(bold).toEqual("hello <span class='message-strikethrough'>Andriy</span> hello");
					});

				it("text3",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatStrikethrough("hello ~Andriy~ hello ~Julia~");
						expect(bold)
							.toEqual("hello <span class='message-strikethrough'>Andriy</span> hello <span class='message-strikethrough'>Julia</span>");
					});

				it("text4",
					() => {
						const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
						const bold = accessor.formatStrikethrough("~hello ~Andriy~ hello ~Julia~");
						expect(bold)
							.toEqual("~hello <span class='message-strikethrough'>Andriy</span> hello <span class='message-strikethrough'>Julia</span>");
					});
			});
		describe("with html", () => {
			it("text2",
				() => {
					const accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
					const bold = accessor.formatStrikethrough("~hello ~<span class='hello'>Andriy</span>~ hello ~Julia~");
					expect(bold)
						.toEqual("~hello <span class='message-strikethrough'><span class='hello'>Andriy</span></span> hello <span class='message-strikethrough'>Julia</span>");
				});
		});
	});
}