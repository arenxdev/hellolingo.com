-- =============================================
-- Author:		Bernard Vanderydt
-- Create date: 2016-02-29
-- Description:	Insert a new mail into the mails table
-- =============================================
CREATE PROCEDURE [dbo].[Mails_Insert]
	@RegulationStatus tinyint
	,@FromId int
	,@ReplyToMail bigint
	,@ToId int
	,@Subject nvarchar(100)
	,@Message nvarchar(max)
AS
BEGIN

-- Collect the ReceiverStatus, to avoid notifing mails to banned users
Declare @ReceiverStatus int
Select @ReceiverStatus = Status from Users where Id = @ToId

IF (@Subject is null OR @Subject = '' )
	Set @Subject = @Message -- This will silently truncate the message. It's the expected behavior.

INSERT INTO dbo.Mails(
	RegulationStatus
	,NotifyStatus
	,FromId
	,FromStatus
	,ReplyToMail
	,ToId
	,ToStatus
	,Subject
	,Message
) VALUES (
	@RegulationStatus
	,Case 
		When @ReceiverStatus = 21 /*Banned*/ Then 21 /*Blocked*/
		When @RegulationStatus = 1 /*Autopass*/ Then 5 /*ToNotify*/
		When @RegulationStatus = 2 /*Autoblock*/ Then 21 /*Blocked*/
		When @RegulationStatus in (11,12) /*BlockAndReview,PassAndReview*/ Then 1 /*PendingRegulation*/
	 End
	,@FromId
	,2 /*Sent*/
	,@ReplyToMail
	,@ToId
	,Case 
		When @RegulationStatus in (1,12) /*Autopass,PassAndReview*/ Then 10 /*New*/
		When @RegulationStatus in (2,11) /*Autoblock,BlockAndReview*/ Then 21 /*Blocked*/
	 End
	,@Subject
	,@Message
)

If (@ReplyToMail is not null) 
	Update Mails Set ToStatus = 12 Where Id = @ReplyToMail

END