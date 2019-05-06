CREATE PROCEDURE [dbo].[Configuration_GetNewSessionTag] (@NewSessionTag bigint OUTPUT)
AS
	-- Get a new SessionTag and increment record for the next session
	BEGIN TRAN T1
		SELECT @NewSessionTag = BigInt FROM Configuration WHERE Name = 'NextSessionTag'
		UPDATE Configuration SET BigInt = BigInt + 1 WHERE Name = 'NextSessionTag'
	COMMIT TRAN T1
