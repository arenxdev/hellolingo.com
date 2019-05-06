/*
Post-Deployment Script
*/

If (Select count(*) from MailRegulationStatuses) = 0 Insert into MailRegulationStatuses values 

(1,'AutoPass'),
(2,'AutoBlock'),
(11,'BlockAndReview'),
(12,'PassAndReview'),
(20,'ManualPass'),
(21,'ManualPassWithoutNotify'),
(22,'ManualBlock'),
(23,'ManualRemoval')