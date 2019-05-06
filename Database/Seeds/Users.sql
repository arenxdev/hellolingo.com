/*
Post-Deployment Script
*/

If (Select count(*) from Users) = 0 Begin

-- Insert some real accounts (they have a corresponding aspNetUser)
	Insert into Users ([LastVisit],[FirstName],[LastName],[Gender],[BirthYear],[BirthMonth],[Country],[Location],[Knows],[Knows2],[Learns],[Introduction],[AspNetId]) VALUES 
		(GetDate()+1,'Bernard','V.','M',1974,2,100,'Washington D.C.',3,1,2,'Hi Everyone. What''s up?','6f52cac3-4191-42c7-8515-baf66a85d571'),
		(GetDate()+1,'Andriy','L.','F',1980,2,100,'Kyiv',3,null,1,'Bonjour','646a0a34-0d72-4252-82c9-7fcad9a76476'),
		
		(GetDate()+1,'Alice','A.','F',1980,2,116,'Wonderland',2,null,1,'Hola','111eb6c0-6ce1-4df6-baee-2f905a30fe77'),
		(GetDate()+1,'Bob','B.','M',2000,2,139,'Athens',19,null,1,'Hi from Greece','222ffbe6-76bb-4dfd-8c98-1a044e61075f'),
		(GetDate()+1,'Carol','C.','F',2000,2,103,'',1,null,2,'Hello','33341166-a809-4fcc-9b13-7959e2da645e'),
		(GetDate()+1,'Dan','D.','M',1930,12,100,'San Diego',2,null,1,'Hola','4445c413-91c4-4908-b625-a4078e87ed2d'),
		(GetDate()+1,'Eve','E.','F',1995,2,104,'Paris',3,null,2,'Bonjour','55554fb2-9f16-4d25-b5d7-ae5f5a554824'),
		(GetDate()+1,'Frank','F.','M',1990,2,100,'Seattle',2,null,3,'Hola','666cba61-3426-402d-bcae-3d4c7e437497'),
		
		(GetDate()+1,'Rebecca','V.','F',2000,7,120,'Liege',3,null,1,'Bonjour','4e918c65-6a99-4376-8379-ff35e03e87de'),
		(GetDate()+1,'Olga','S.','F',1984,2,100,'Austin',1,3,4,'Hi Everyone. What''s up?','be6753f5-6d8d-4ee4-8a1a-8d30ea9ee6e0')




End