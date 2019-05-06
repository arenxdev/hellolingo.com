-- =============================================
-- Author:		Bernard Vanderydt
-- Create date: 2016-02-21
-- Description:	Return an age in years, based on @ReferenceDate (generally, now) and a YYYY-MM
--				Age will be based on the birthday being the first day of the following month.
-- =============================================
CREATE FUNCTION fxAgeFromYYYYMM (
	@Year int,
	@Month tinyint,
	@ReferenceDate DateTime
)
RETURNS int
AS
BEGIN

	-- Age will be based on the birthday being the first day of the following month 
	declare @BirthDate datetime = DateAdd(mm, 1, cast (cast(@Year as varchar)+'-'+cast(@Month as varchar)+'-01' as date))
	Return DatePart(yy, @ReferenceDate-@BirthDate)-1900

END