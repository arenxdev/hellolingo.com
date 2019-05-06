-- =============================================
-- Author:		Bernard Vanderydt
-- Create date: 2016-02-29
-- Description:	Mark a mail and all its the other mails in the same thread
-- =============================================
CREATE PROCEDURE [dbo].[Mails_Archive]
	@UserId Int, @MailId BigInt
AS
BEGIN

	Declare @PartnerId int
	Select @PartnerId = Case When FromId = @UserId Then ToId Else FromId End from Mails where Id = @MailId

	Update Mails Set FromStatus = 20 where FromId = @UserId And ToId = @PartnerId
	Update Mails Set ToStatus = 20 where FromId = @PartnerId And ToId = @UserId

END