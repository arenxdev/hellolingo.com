-- =============================================
-- Author:		Bernard Vanderydt
-- Create date: 2016-08-10
-- Description:	Get history of a particular chat room
-- =============================================
CREATE  PROCEDURE [dbo].TextChat_GetHistory 
	@Count INT,
	@RoomId NVARCHAR(20) = null,
	@VisibilitiesCsv varchar(max)
AS
BEGIN
	SET NOCOUNT ON; -- Prevent extra result sets from interfering with SELECT statements

	if @Count is null SET @Count = 100

	Select top (@Count) [When], UserId, FirstName, RoomId, [Text], Visibility 
	from TextChat where RoomId = @RoomId and Visibility in (SELECT Item FROM SplitInts(@VisibilitiesCsv, ',')) 
	order by ID Desc


END



--Select top 300 * from TextChat where roomid = 'English' and visibility = 1 order by id desc