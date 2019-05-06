/*
Post-Deployment Script
*/

If (Select count(*) from [VoiceCallOutcomes]) = 0 INSERT INTO [dbo].[VoiceCallOutcomes] ([Id], [Outcome]) VALUES 

(1, N'Decline'),
(2, N'Ignore'),
(3, N'Block'),
(4, N'AutoIgnore'),
(8, N'Cancel'),
(9, N'TimeOut'),
(11, N'CallerHangout'),
(12, N'CalleeHangout'),
(13, N'CallerLeft'),
(14, N'CalleeLeft'),
(17, N'LostCaller'),
(18, N'LostCallee'),
(19, N'ForceDisconnect'),
(20, N'Deny'),
(24, N'FailOnCallerUnsupportedBrowser'),
(25, N'FailOnCalleeUnsupportedBrowser'),
(26, N'FailOnCallerMicNotFound'),
(27, N'FailOnCalleeMicNotFound'),
(30, N'Error')
