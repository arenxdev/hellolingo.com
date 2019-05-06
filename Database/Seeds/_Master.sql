/*
Post-Deployment Script
Start all other deployment scripts
*/

:r .\Configuration.sql

:r .\MessageVisibilityTypes.sql
:r .\TextChat.sql
:r .\TextChatTrackerStatuses.sql

:r .\Languages.sql
:r .\Countries.sql
:r .\UsersStatuses.sql

:r .\AspNetUsers.sql
:r .\Users.sql

:r .\UsersTagsValues.sql
:r .\UsersTags.sql

:r .\UsersChangesTypes.sql

:r .\NotifyMediums.sql
:r .\NotifyStatuses.sql
:r .\Notify.sql

:r .\MailRegulationStatuses.sql
:r .\MailStatuses.sql
:r .\Mails.sql

:r .\SourceFeatures.sql
:r .\VoiceCallOutcomes.sql
:r .\VoicePlatforms.sql

:r .\TilesFilters.sql

:r .\TextChatRoomTypes.sql
