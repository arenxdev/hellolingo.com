/*
Post-Deployment Script
*/

Declare @visibility NVARCHAR(25)
Declare @id TINYINT

SET @visibility = 'Nobody' SET @id = 0
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

SET @visibility = 'Everyone' SET @id = 1
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

SET @visibility = 'Sender' SET @id = 5
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

SET @visibility = 'News' SET @id = 10
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

/* Will be posted by a process in realtime. Shouldn't be visible outside of that event */
SET @visibility = 'Ephemeral' SET @id = 11
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

SET @visibility = 'Moderators' SET @id = 50
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

SET @visibility = 'System' SET @id = 99
IF NOT EXISTS (SELECT * FROM [dbo].MessageVisibilityTypes WHERE id = @id)
  INSERT INTO [dbo].MessageVisibilityTypes (ID, Visibility) VALUES (@id, @visibility)
ELSE UPDATE [dbo].MessageVisibilityTypes SET Visibility = @visibility WHERE Id = @id

