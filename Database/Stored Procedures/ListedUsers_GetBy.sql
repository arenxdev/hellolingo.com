-- =============================================
-- Author:		Bernard Vanderydt
-- Create date: 2016-02-21
-- Description:	Get a list of users' profiles based on criteria
-- Important: As of Feb 2016, default value are useless in when the Sproc is used in combination with Entity Frmework
-- =============================================
CREATE PROCEDURE [dbo].[ListedUsers_GetBy] 
	@Count INT /* Default value enforced below */, -- How many records we want
	@BelowId INT = null,					-- Below which ID do we get the records
	@Knows INT = null,
	@Learns INT = null,
	@FirstName NVARCHAR(25) = null, 
	@LastName NVARCHAR(40) = null,
	@Country INT = null,
	@Location NVARCHAR(40) = null,
	--@LocationFragment NVARCHAR(40) = null,	-- What does the location contain
	@MinAge INT = 0, @MaxAge INT = 99,
	@Tag INT = null
AS
BEGIN
	SET NOCOUNT ON; -- Prevent extra result sets from interfering with SELECT statements

	DECLARE @MinResults INT = 50 -- The minimum amount of results we want before we start to show inactive users
	 
	if @Count is null SET @Count = 100 

	SELECT TOP (@Count) * INTO #result FROM ListedUsers U
	WHERE (@BelowId is null OR Id < @BelowId)
		AND (@Knows is null or @Knows = Knows)
		AND (@Learns is null or @Learns = Learns)
		AND (@FirstName is null OR FirstName like @FirstName+'%')
		AND (@LastName is null OR LastName like @LastName+'%')
		AND (@Country is null OR @Country = Country)
		AND (@Location is null OR @Location = Location)
		--AND (@LocationFragment is null OR @Location like '%'+@LocationFragment+'%')
		AND (@MinAge is null OR @MinAge <= Age)
		AND (@MaxAge is null OR @MaxAge >= Age)
		AND (@Tag is null OR Exists (select TagId from UsersTags Ut where UT.UserId = U.Id and UT.TagId = @Tag))
	UNION SELECT TOP 1 * FROM ListedUsers WHERE 1 = 0 -- <
	ORDER BY Id DESC 

		
	if @@ROWCOUNT < @MinResults And @BelowId is null BEGIN
		INSERT INTO #result SELECT TOP (@Count) * FROM InactiveUsers U
		WHERE (@Knows is null or @Knows = Knows)
			AND (@Learns is null or @Learns = Learns)
			AND (@FirstName is null OR FirstName like @FirstName+'%')
			AND (@LastName is null OR LastName like @LastName+'%')
			AND (@Country is null OR @Country = Country)
			AND (@Location is null OR @Location = Location)
			--AND (@LocationFragment is null OR @Location like '%'+@LocationFragment+'%')
			AND (@MinAge is null  OR @MinAge <= Age)
			AND (@MaxAge is null  OR @MaxAge >= Age)
			AND (@Tag is null OR Exists (select TagId from UsersTags Ut where UT.UserId = U.Id and UT.TagId = @Tag))
		ORDER BY Id DESC 
	END

	Select * from #result
--	Select @@ROWCOUNT
	-- Add a selection of inactive members at the end (if there is no BelowId and 

END