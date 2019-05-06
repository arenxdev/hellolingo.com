/*
Post-Deployment Script
*/

-- The procedure doesn't allow to insert already read emails, which is fair, but inconvenient. We should insert straight into the table so as to have a more convenient seeded list of emails

EXEC [dbo].[Mails_Insert] 12, 1, null, 2, /*11,*/ 'User 1 => User 2', 'I''d like to write a longer message but I won''t'
EXEC [dbo].[Mails_Insert] 12, 2, 1,    1, /*10,*/ 'Re: User 2 => User 1', 'Your message is long enough!'
EXEC [dbo].[Mails_Insert] 12, 1, null, 3, /*11,*/ 'User 1 => User 3', 'I''d like to write ANOTHER longer message but I won''t'
EXEC [dbo].[Mails_Insert] 12, 2, null, 3, /*10,*/ 'User 2 => User 3', 'I''d like to write a longer message TOO but I won''t'
