-- Step 1: Delete all inserted permissions
DELETE FROM permissions
WHERE permission_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19);

-- Step 2: Drop the newly added foreign key constraints
ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;

-- Step 3: Drop the title column if it didn't previously exist
ALTER TABLE permissions DROP COLUMN IF EXISTS title;
