/*
Post-Deployment Script
*/

If (Select count(*) from UsersStatuses) = 0 Insert into UsersStatuses values 

(1,'Valid'),
(5,'PendingEmailValidation'),
(9,'PendingSignUpReview'),
(10,'TemporarilyDisabled'),
(20,'Deleted')
