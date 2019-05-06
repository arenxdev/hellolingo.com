class UiCultureDropDown implements ng.IDirective {
    static $inject = ["$templateCache", "authService", "$stickyState", "$state", "modalService"];
    constructor(private $templateCache: ng.ITemplateCacheService, private authService: Authentication.IAuthenticationService,
				private $stickyState: ng.ui.IStickyStateService, private $state: ng.ui.IStateService,
				private modalService: Services.IModalWindowService) { }

    template = this.$templateCache.get("ui-culture-drop-down.tpl") as Function;
	i10NUnavailableStatusTemplate = "At this time, Hellolingo isn't available in #LANG#. Our members are actively translating Hellolingo in their preferred languages. Please <a href='/contact-us'>contact us</a> if you'd like to contribute to the #LANG# version of Hellolingo.";

    controller = ["$scope", "$cookies", ($scope, $cookies) => {
        $scope.uiCultures = <{ [code: string]: { text: string, i10NStatus: string } }>{

			// Text that doesn't appears only in languages other than English, because English is always fully localized:
			//		1. "Hellolingo in ________ is made possible thanks to our members and friends: [Your name here, if you want]
			//		2. "At this time, about 50% of Hellolingo is in ________. We'll display text that hasn't been translated yet in English. Don't hesitate to contact us if you want to help complete the ________ version of Hellolingo."

			"en"    : /* 100% */ { text: Languages.english.text,    i10NStatus: "Hellolingo in English is made possible thanks to our members and friends:<br><br><strong>Olga 'Awesome' S.<br>Laura K.<br>Mark A.</strong>"},
			"fr"    : /* 100% */ { text: Languages.french.text,     i10NStatus: "Hellolingo est disponible en Français grâce à nos membres et amis:<br><br><strong>Claire Verday<br><a href='http://www.linkedin.com/in/bernardvanderydt' target='_blank'>Bernard Vanderydt</a></strong>"},
			"de"    : /* 100% */ { text: Languages.german.text,     i10NStatus: "Hellolingo auf Deutsch wird mithilfe unserer Mitglieder und Freunde ermöglicht:<br><br><strong><a href='https://www.linkedin.com/in/flavia-rocco-a4bb07b8' target='_blank'>Flavia 'Sayuri' Rocco</a></strong>" /*"<br><br>Zur Zeit sind rund <strong>56%</strong> von Hellolingo auf Deutsch. Die Teile des Textes, die noch nicht übersetzt sind, werden auf Englisch gezeigt.<br><br>Bitte <a href='/contact-us'>kontaktieren</a> Sie uns, wenn Sie helfen wollen, die deutsche Version von Hellolingo zu ergänzen."*/ },
			"es"    : /* 100% */ { text: Languages.spanish.text,    i10NStatus: "Hellolingo en español es posible gracias a nuestros miembros y amigos:<br><br><strong>Quals & Co.<br><a href='/mailbox/user/31148/new' target='_blank'>Nina</a></strong>" /*"<br><br>En este momento, alrededor de un <strong>99%</strong> de Hellolingo está en español. Los textos que todavía no han sido traducidos aparecerán en inglés.<br><br>No dudes en <a href='/contact-us'>contactarnos</a> si quieres ayudar a completar la versión en español de Hellolingo." */},
			"ko"    : /* 100% */ { text: Languages.korean.text,     i10NStatus: "Hellolingo 한국어 버전 제작은 저희의 회원들과 친구들 덕분에 가능했습니다:<br><br><strong>Bona Sheen</strong>" /* "<br><br>현재, Hellolingo의 <strong>48%</strong> 정도가 한국어 버전으로 만들어져 있습니다. 아직 번역이 되지 않은 부분은 영문으로 표시될 것입니다. Hellolingo 한국어 버전 완성에 도움을 주고 싶으시다면, <a href='/contact-us'>망설이지 말고 저희에게 연락해주세요</a>." */},
			"nl"    : /* 100% */ { text: Languages.dutch.text,      i10NStatus: "Hellolingo in het Nederlands wordt mede mogelijk gemaakt door onze leden en vrienden:<br><br><strong>Poiet O.<br><a href='https://www.linkedin.com/in/flavia-rocco-a4bb07b8' target='_blank'>Flavia 'Sayuri' Rocco</a></strong>" /*+ "<br><br>Op dit moment is ongeveer <strong>98%</strong> van Hellolingo in het Nederlands. De tekst die nog niet is vertaald zal worden weergegeven in het Engels.<br><br>Aarzel niet <a href='/contact-us'>contact</a> met ons op te nemen indien u ons wilt helpen de nederlandse versie van Hellolingo te voltooien." */ },
			"it"    : /* 100% */ { text: Languages.italian.text,    i10NStatus: "Hellolingo in italiano è reso possibile grazie ai nostri seguenti amici e membri:<br><br><strong>Alberto Fanciullacci</strong>" /* "<br><br>Al momento circa il <strong>56%</strong> di Hellolingo è stato tradotto in italiano. Le parti che non sono ancora state tradotte verranno mostrate in inglese. Non esitare a <a href='/contact-us'>contattarci</a> se vuoi aiutarci a completare la versione italiana di Hellolingo." */ },
			"pt-BR" : /* 100% */ { text: Languages.portuguese.text, i10NStatus: "Hellolingo em Português é possível graças a nossos membros e amigos:<br><br><strong>Mark A.</strong>" /*+ "<br><br>Neste momento, por volta de <strong>56%</strong> do Hellolingo está em português. Os textos que ainda não foram traduzidos aparecerão em inglês.<br><br>Não deixe de <a href='/contact-us'>nos contactar</a> se quiser ajudar a completar a versão em português do Hellolingo."*/ }, 
			"ru"    : /* 100% */ { text: Languages.russian.text,    i10NStatus: "Русская версия Hellolingo появилась благодаря нашим участникам и друзьям:<br><br><strong>Olga 'Awesome' S.<br><a href='/mailbox/user/29433/new' target='_blank'>Liliya Vengura</a><br><a href='/mailbox/user/47633/new' target='_blank'>Dmitry Khomichuk</a></strong>" /*"<br><br>На данный момент, около <strong>70%</strong> сайта Hellolingo был переведен на русский язык. Текст, который ещё не был переведен, будет отображен на английском.<br><br>Если вы хотите помочь нам с переводом Русской версии Hellolingo, <a href='/contact-us'>свяжитесь с нами</a>!"*/ },
			"zh-CN" : /*  95% */ { text: Languages.chinese.text,    i10NStatus: "谢谢我们的用户和朋友们的帮助，使Hellolingo能够被翻译成中文版本。<br><br><strong>税诚 Alexander</strong><br><br>到现在为止，大约百分之95的Hellolingo已经被翻译成中文。我们将会把目前还未翻译部分的文本展示出来，如果您想帮助我们完成Hellolingo的中文部分，<a href='/contact-us'>请不要犹豫，赶快联系我们吧！</a>" },
			"he"    : /*  95% */ { text: Languages.hebrew.text,     i10NStatus: "Hellolingo תורגם לעברית תודות לחברינו בישראל. <br><br><strong><a href='/mailbox/user/62058/new' target='_blank'>Ben x.</a></strong><br><br>כרגע רק כ-95% מ-Hellolingo מתורגם לעברית. טקסט שטרם תורגם מוצג באנגלית. אם אתם מעוניינים לעזור להשלים את הגרסה העברית של הלו-לינגו, אל תהססו וצרו קשר."},
			"el"    : /*  70% */ { text: Languages.greek.text,      i10NStatus: "Το Hellolingo στα Ελληνικά είναι εφικτό χάρη στα μέλη και τους φίλους μας:<br><br><strong><a href='/mailbox/user/96680/new' target='_blank'>Andreas Panagiotidis</a></strong><br><br>Αυτή τη στιγμή, περίπου το 70% του Hellolingo είναι στα ελληνικά. Θα προβάλλουμε κείμενο που δεν έχει μεταφραστεί ακόμα στα αγγλικά. Μη διστάσετε να επικοινωνήσετε μαζί μας αν θέλετε να βοηθήσετε να ολοκληρωθεί η Ελληνική έκδοση του Hellolingo" },
			"ja"    : /*  56% */ { text: Languages.japanese.text,   i10NStatus: "日本語でのHelloLingoはメンバーとお友達の寄付のおかげです。<br><br><strong>Keith McKay</strong><br><br>この時は５６％のHelloLingoが日本語で翻訳されています。まだ翻訳していない部分が英語で示されます。HelloLingoの日本語に変化に手を借りたかったら、気軽にどうぞ連絡してください。" },
			"tr"    : /*  35% */ { text: Languages.turkish.text,    i10NStatus: "Hellolingo'nun Türkçe dilinde olmasını sağlayan üye ve arkadaşlarımıza teşekkürler.<br><br>Şimdlik, Hellolingo'nun yaklaşık %35'si Türkçeleştirilmiştir.Türkçeleştirilmemiş olanları İngilizce olarak göstereceğiz.Hellolingo'nun Türkçe sürümünü tamamlamak için yardım etmek isterseniz biz yazmaktan çekinmeyin"},
			"cs"    : /*  35% */ { text: Languages.czech.text,      i10NStatus: "Hellolingo v Čeština je možné díky našim členům a přátelům. <br><br><strong><a href='/mailbox/user/73640/new' target='_blank'>Josef Bukač</a></strong><br><br>Nyní je asi 35% Hellolingo v Čeština. Budeme zobrazovat text, který dosud nebyl přeložený do angličtiny. Neváhejte nás kontaktovat, pokud chcete pomoct s kompletní Čeština verzí Hellolingo." },
			"vi"    : /*  35% */ { text: Languages.vietnamese.text, i10NStatus: "Một cộng đồng được xây nên bởi chính những thành viên. Hiện tại, khoảng 35% của Hellolingo là Tiếng Việt. <br><br><strong><a href='/mailbox/user/40229/new' target='_blank'>Khue Nguyen</a></strong><br><br>Chúng tôi sẽ hiển thị phần chưa được dịch bằng Tiếng Anh. Đừng ngần ngại liên hệ với chúng tôi nếu bạn muốn giúp hoàn thành phiên bản Tiếng Việt của Hellolingo." },
			"et"    : /*  19% */ { text: Languages.esperanto.text,  i10NStatus: "Hellolingo en Esperanto eblas danke al niaj membroj kaj amikoj:<br><br><strong>'sennoma nordulo'</strong><br><br>Momente, ĉirkaŭ <strong>19%</strong> de Hellolingo disponeblas en Esperanto. Teksto ne tradukita montriĝos angle.<br><br>Ne hezitu <a href='/contact-us'>kontakti</a> nin se vi volas kontribui al kompletigo de la tasko." }, /* Normally, the code for Esperanto should be 'eo', but the production server doesn't support that culture (though Bernard's dev machine does), so we hijacked et (estonian) and used it for Esperanto */
			"pl"    : /*   0% */ { text: Languages.polish.text,     i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Polish") }, // Credit Marcin for it and link to his mailbox

			// Later, maybe
			"sv"    : { text: Languages.swedish.text,    i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Swedish") },
			"fi"    : { text: Languages.finnish.text,    i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Finnish") },
			"nb"    : { text: Languages.norwegian.text,  i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Norwegian") },
			"ro"    : { text: Languages.romanian.text,   i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Romanian") },
			"ar"    : { text: Languages.arabic.text,     i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Arabic") },
			"fa"    : { text: Languages.persian.text,    i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Persian") },
			"hi"    : { text: Languages.hindi.text,      i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Hindi") },
			"th"    : { text: Languages.thai.text,       i10NStatus: this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Thai") }
		};

		$scope.uiCultureCode = Runtime.uiCultureCode;
        $scope.changeUiCultureTo = (code, okButtonText) => {
            if (code !== Runtime.uiCultureCode) {
				let targetCulture = $scope.uiCultures[code];
				this.modalService.open(
					`<div class='i10nStatus' dir='${code === "he" ? "rtl":"ltr"}'>${targetCulture.i10NStatus}<div>`,
					[{ label: okButtonText, result: true, cssClass: "btn btn-success" }],
					false // Allows people to click the backdrop to close the window
				).then((confirmed) => {
					if (confirmed) {
						$cookies.put(Config.CookieNames.oldUiCulture, Runtime.uiCultureCode); // TODOLATER: Extract cookie.put to Runtime
						$cookies.put(Config.CookieNames.uiCulture, code);
						Runtime.uiCultureCode = code;
						location.reload();
					}
				});
            }
        };

	    $scope.isMember = () => this.authService.isAuthenticated();

        $scope.isEnabled = ()=> {
            return !this.authService.isAuthenticated()
				|| (
					[States.home.name, States.livemocha.name, States.sharedTalk.name].some(s => s === this.$state.current.name)
					&& this.$stickyState.getInactiveStates().length === 0
				);
        }
    }];

}
