/*
Post-Deployment Script
*/

If (Select count(*) from TilesFilters) = 0 INSERT INTO [dbo].TilesFilters ([Id], Type) VALUES

	(1, N'Promote'),
	(2, N'Demote'),
	(3, N'Show'),
	(4, N'Hide')
