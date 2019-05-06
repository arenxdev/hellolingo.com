/*
Post-Deployment Script
*/

If (Select count(*) from [dbo].[VoicePlatforms]) = 0 INSERT INTO [dbo].[VoicePlatforms] ([Id],[PlatformName],[PlatformText],[ThirdParty],[ContactIdNaming],[ContactIdRegex],[RgbColor]) VALUES
(1, N'OnSiteWebRtc', N'Hellolingo Voice', 0, NULL, NULL, NULL),
(10, N'Skype', N'Skype', 1, N'Skype ID', N'(^[a-zA-Z][a-zA-Z0-9\.\-_]{5,31}$)|(^live:[a-zA-Z0-9][a-zA-Z0-9\.\-_]{5,31}$)|(^[a-zA-Z0-0][a-zA-Z0-9_.-]{3,}@[a-zA-Z0-9_-]{2,}\.[a-zA-Z0-9]{2,}$)', N'00AFF0'),
(11, N'WhatsApp', N'WhatsApp', 1, N'WhatsApp #', N'^\+{0,1}[0-9\-]{5,31}$', N'40C353'),
(12, N'Viber', N'Viber', 1, N'Viber #', N'^\+{0,1}[0-9\-]{5,31}$', N'7B519C'),
(13, N'WeChat', N'WeChat', 1, N'WeChat ID', N'^([a-zA-Z][a-zA-Z0-9\-_]{5,19})|(\+{0,1}[0-9\-]{5,31})$', N'00CD0D'),
(14, N'Hangouts', N'Hangouts', 1, N'Gmail address', N'^[a-zA-Z0-0][a-zA-Z0-9_.-]{4,}@g(oogle)?mail\.com$', N'119E5A'),
(15, N'Icq', N'ICQ', 1, N'ICQ #', N'[0-9]{5,11}', N'EE0000'),
(16, N'Qq', N'QQ', 1, N'QQ #', N'[0-9]{5,16}', N'000000'),
(17, N'Oovoo', N'ooVoo', 1, N'ooVoo ID', N'[a-zA-Z0-9][a-zA-Z0-9\.\-_]{5,28}', N'FAA61D'),
(18, N'LineMe', N'Line.me', 1, N'User ID', N'.{6,20}', N'19BE05'),
(19, N'KakaoTalk', N'KakaoTalk', 1, N'KakaoTalk ID', N'^[a-zA-Z][a-zA-Z0-9]{4,15}$', N'D9AE14'),
(20, N'Kik', N'Kik', 1, N'Kik ID', N'[a-zA-Z0-9_]{2,20}', N'6DBE35')

