/*
Post-Deployment Script
*/

If (Select count(*) from NotifyStatuses) = 0 Insert into NotifyStatuses values 

(1,'PendingRegulation'),
(5,'ToNotify'),
(7,'NoLongerNeeded'),
(10,'Notified'),
(15,'Failed'),
(21,'Blocked')
