/*
Post-Deployment Script
*/

If (Select count(*) from UsersChangesTypes) = 0 INSERT INTO UsersChangesTypes VALUES

	(1,'AutoRegulation'),
	(10,'PreSignUp'),
	(11,'ByUser'),
	(12,'ByAdminRequest'),
	(20,'OnUserDemand'),
	(21,'ByAdmin')
