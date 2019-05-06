-- =============================================
-- Author:		Bernard Vanderydt
-- Create date: 2016-02-29
-- Description:	Get List of Mails for a particular user
-- =============================================
CREATE PROCEDURE [dbo].[Mails_GetList]
	@Id int
AS
BEGIN

-- Mark user's mail as notified
Update Mails Set NotifyStatus = 7 Where ToId = @Id and NotifyStatus in (1, 5)

-- Retrieve user's mails
Select M.Id, [When]
	,Case When M.Id in (
		Select Max(Id) from Mails WHERE @Id in (FromId, ToId) group by case when FromId < ToId Then FromId+'-'+ToId Else ToId+'-'+FromId End
	) Then 'true' else 'false' end [Lead]
	,FromId, ToId,ReplyToMail, Status, PartnerDisplayName, Subject
From (
	Select M.Id,[When],FromId,ToId,ReplyToMail, FromStatus [Status], U.FirstName+' '+U.LastName [PartnerDisplayName], [Subject] From Mails M
	Join Users U on (M.ToId = U.Id)
	Where FromId = @Id AND FromStatus in (1,2,20) -- Draft, Sent and Archived Mails

	Union Select M.Id,[When],[FromId],[ToId],ReplyToMail,[ToStatus], U.FirstName+' '+U.LastName [PartnerDisplayName], [Subject]
	From Mails M
	Join Users U on (M.FromId = U.Id)
	Where ToId = @Id AND ToStatus in (10,11,12,20,22) -- New, Read, RepliedTo, Archived and Purged
) AS M
-- Don't try to use that more elegant join, because it makes the query real slow. Instead, the joins have been applied independently to the two Selects that are unioned above
--Join Users U on ((M.FromId <> @Id AND M.FromId = U.Id) OR (M.ToId <> @Id AND M.ToId = U.Id))
ORDER BY M.Id DESC





  

END