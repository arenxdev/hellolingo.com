CREATE TABLE [dbo].[Configuration]
(
	[Name] VARCHAR(50) NOT NULL PRIMARY KEY, 
  [Int] INT NULL,
  [BigInt] BIGINT NULL, 
  [Bit] BIT NULL, 
  [DateTime] DATETIME NULL, 
  [Text] NVARCHAR(MAX) NULL
)
