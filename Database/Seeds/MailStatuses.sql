/*
Post-Deployment Script
*/

If (Select count(*) from MailStatuses) = 0 Insert into MailStatuses values 

(1,'Draft'),
(2,'Sent'),
(5,'PendingRegulation'),
(10,'New'),
(11,'Read'),
(12,'RepliedTo'),
(15,'Hidden'),
(16,'Reported'),
(20,'Archived'),
(21,'Blocked'),
(22,'Purged'),
(99,'Deleted')
