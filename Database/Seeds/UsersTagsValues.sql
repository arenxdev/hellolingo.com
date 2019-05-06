/*
Post-Deployment Script
*/

If (Select count(*) from UsersTagsValues) = 0 Insert into UsersTagsValues values 

(1, 'AgreeWithTermsOfUse', ''),
(3, 'WantsToHelpHellolingo', ''),
(4, 'FormerSharedTalkMember', ''),
(5, 'LivemochaMember', ''),
(6, 'SharedLingoMember', ''),
(10, 'LookToLearnWithTextChat', ''),
(11, 'LookToLearnWithVoiceChat', ''),
(12, 'LookToLearnWithGames', ''),
(13, 'LookToLearnWithMore', ''),
(90, 'EmailFailed', ''),
(1001, 'TextChatNoPrivateChat','')
