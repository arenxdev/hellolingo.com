/*
This ads an executor role to the database (not the server).
Assign that role to users accessing this database to grant execute permissions
to ALL stored procedures, instead of having to do it one by one (and also for new SPROCs)
*/
IF DATABASE_PRINCIPAL_ID('db_executor') IS NULL
BEGIN
	CREATE ROLE db_executor;
	GRANT EXECUTE TO db_executor;
END