-- #1
insert into account
(account_fisrtname, account_lastname, account_email, account_password)
values
('Tony', 'Stark','tony@starkent.com', 'Iam1ronM@n');

-- #2
UPDATE account 
SET account_type = 'Admin'
WHERE account_fisrtname = 'Tony';

-- #3
DELETE 
FROM account
WHERE account_fisrtname = 'Tony';

-- #4
UPDATE inventory
SET inv_description = REPLACE (inv_description, 'small interiors', 'a huge interior');

-- #5
SELECT	
	inventory.inv_model,
	inventory.inv_make,
	classification.classification_name
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification.classification_id = 2;

-- #6
UPDATE
	inventory
SET 
	inv_image = REPLACE(inv_image,'/images/', '/images/vehicles/')
UPDATE
	inventory
SET
	inv_thumbnail = REPLACE(inv_thumbnail,'/images/', '/images/vehicles/')