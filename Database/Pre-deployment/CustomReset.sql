/*
 Pre-Deployment Script
 
 WARNING !!!
 WARNING !!!
 WARNING !!!

 THIS IS DESTRUCTIVE STUFF!!!
 NOT SUITABLE FOR PRODUCTION !!!

 WARNING !!!
 WARNING !!!
 WARNING !!!

 This provides ways to reset part of the database only, rather than recreating it fully.
 They are ordered so that deletes won't fail on key constraints

*/

--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'UsersTags') BEGIN Delete from UsersTags END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'UsersTagsValues') BEGIN Delete from UsersTagsValues END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'Users') BEGIN Delete from Users END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AspNetUsers') BEGIN Delete from AspNetUsers END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'Languages') BEGIN Delete from Languages END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'Countries') BEGIN Delete from Countries END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'UsersStatuses') BEGIN Delete from UsersStatuses END
--IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'TextChat') BEGIN Delete from TextChat END

