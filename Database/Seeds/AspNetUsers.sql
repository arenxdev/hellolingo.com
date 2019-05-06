/*
Post-Deployment Script
*/

IF (SELECT COUNT(*) FROM AspNetUsers) = 0 

 	INSERT INTO AspNetUsers ([Id],[Hometown],[Email],[EmailConfirmed],[PasswordHash],[SecurityStamp],[PhoneNumber],[PhoneNumberConfirmed],[TwoFactorEnabled],[LockoutEndDateUtc],[LockoutEnabled],[AccessFailedCount],[UserName], [UiCulture])
	VALUES /*password = qazwsx1 */ ('6f52cac3-4191-42c7-8515-baf66a85d571', NULL,'bernard@hellolingo.com', 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'bernard@hellolingo.com','en'),
           /*password = qazwsx1 */ ('646a0a34-0d72-4252-82c9-7fcad9a76476', NULL,'andriy@hellolingo.com', 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','51322b0b-41bd-4d53-8f3b-1dd9f105d437',NULL,0,0,NULL,1,0,'andriy@hellolingo.com','en'),

				 /*password = qazwsx1 */ ('111eb6c0-6ce1-4df6-baee-2f905a30fe77', NULL,'alice@test.com'   , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'alice@test.com','en'),
				 /*password = qazwsx1 */ ('222ffbe6-76bb-4dfd-8c98-1a044e61075f', NULL,'bob@test.com'     , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'bob@test.com','en'),
				 /*password = qazwsx1 */ ('33341166-a809-4fcc-9b13-7959e2da645e', NULL,'carol@test.com'   , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'carol@test.com','en'),
				 /*password = qazwsx1 */ ('4445c413-91c4-4908-b625-a4078e87ed2d', NULL,'dan@test.com'     , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'dan@test.com','en'),
				 /*password = qazwsx1 */ ('55554fb2-9f16-4d25-b5d7-ae5f5a554824', NULL,'eve@test.com'     , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'eve@test.com','en'),
				 /*password = qazwsx1 */ ('666cba61-3426-402d-bcae-3d4c7e437497', NULL,'frank@test.com'   , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'frank@test.com','en'),

				 /*password = qazwsx1 */ ('be6753f5-6d8d-4ee4-8a1a-8d30ea9ee6e0', NULL,'olga@test.com'    , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'olga@test.com','en'),
				 /*password = qazwsx1 */ ('4e918c65-6a99-4376-8379-ff35e03e87de', NULL,'rebecca@test.com' , 1, 'AMb/Luc6dzsOy78PmLwyF7rcAKQ1qM3eijqqbzYf+65JwFAEIx1sEGi5jX051NvRqw==','a23c9a12-a042-42c6-852f-0e25336e1085',NULL,0,0,NULL,1,0,'rebecca@test.com','en')
	