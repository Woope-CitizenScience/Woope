ALTER TABLE role_permissions
DROP CONSTRAINT role_permissions_role_id_fkey,
                ADD CONSTRAINT role_permissions_role_id_fkey
FOREIGN KEY (role_id) REFERENCES roles(role_id) ON
DELETE CASCADE;


ALTER TABLE permissions ADD title VARCHAR(255);