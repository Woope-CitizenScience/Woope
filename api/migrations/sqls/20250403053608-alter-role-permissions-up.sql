-- ALTER TABLE role_permissions
-- -- DROP CONSTRAINT role_permissions_role_id_fkey,
-- ADD CONSTRAINT role_permissions_role_id_fkey
-- FOREIGN KEY (role_id) REFERENCES roles(role_id) ON
-- DELETE CASCADE;


-- ALTER TABLE role_permissions
-- -- DROP CONSTRAINT role_permissions_permission_id_fkey,
-- ADD CONSTRAINT role_permissions_permission_id_fkey
-- FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON
-- DELETE CASCADE;


ALTER TABLE permissions ADD title VARCHAR(255);

DELETE FROM permissions;

INSERT INTO permissions VALUES
(1, 'delete_all_posts', 'Delete All Posts'),
(2, 'edit_all_posts', 'Edit All Posts'),
(3, 'edit_all_organizations', 'Edit All Organizations'),
(4, 'create_org_posts', 'Create Organization Posts'),
(5, 'edit_org_posts', 'Edit Organization Posts'),
(6, 'delete_org_posts', 'Delete Organization Posts'),
(7, 'delete_own_pin', 'Delete Own Pins'),
(8, 'delete_all_pins', 'Delete All Pins'),
(9, 'create_post', 'Create Posts'),
(10, 'edit_own_post', 'Edit Own Post'),
(11, 'delete_own_post', 'Delete Own Post'),
(12, 'create_event', 'Create Event'),
(13, 'edit_own_event', 'Edit Own Event'),
(14, 'edit_all_events', 'Edit All Events'),
(15, 'delete_own_event', 'Delete Own Event'),
(16, 'delete_all_events', 'Delete All Events'),
(17, 'manage_users_in_org', 'Manage Users In Org'),
(18, 'edit_users', 'Edit Users'),
(19, 'edit_organization', 'Edit Organization');