CREATE PROCEDURE [dbo].[Configuration_GetNewDeviceTag] (@NewDeviceTag bigint OUTPUT)
AS
	-- Get a new Device Tag and increment record for the next device
	BEGIN TRAN T1
		SELECT @NewDeviceTag = BigInt FROM Configuration WHERE Name = 'NextDeviceTag'
		UPDATE Configuration SET BigInt = BigInt + 1 WHERE Name = 'NextDeviceTag'
	COMMIT TRAN T1
