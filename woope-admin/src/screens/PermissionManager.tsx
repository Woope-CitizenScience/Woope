import React, { ReactElement, useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Checkbox from "../components/Checkbox";
import Modal from "../components/Modal";
import RoleListGroup from "../components/RoleListGroup";
import {
  createRole,
  createRolePermission,
  deleteRole,
  deleteRolePermission,
  getPermissions,
  getRolePermissions,
  getRoles,
} from "../api/roles";

interface Permission {
  permission_id: number;
  name: string;
  title: string;
  active: boolean;
  changed: boolean;
}

interface Role {
  role_id: number;
  name: string;
}

const PermissionManager = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleCreated, setRoleCreated] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [roles]);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res);
    } catch (e) {
      console.log("Error fetching roles: " + e);
    }
  };

  const fetchPermissions = async () => {
    try {
      let res: Permission[] = await getPermissions();
      setPermissions(res);
    } catch (e) {
      console.log("Error fetching permissions: " + e);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedRole) {
      return;
    }
    permissions.forEach((perm) => {
      if (perm.changed) {
        if (perm.active) {
          createRolePermission(selectedRole?.role_id, perm.permission_id);
        } else {
          deleteRolePermission(selectedRole?.role_id, perm.permission_id);
        }
      }
    });

    alert("Changes saved.");
  };

  const handleSelectRole = async (role: Role | null) => {
    setSelectedRole(role);
    if (!role) return;

    try {
      const rolePerms = await getRolePermissions(role.role_id); // Fetch only selected role's permissions
      const rolePermIds = rolePerms.map((perm: any) => perm.permission_id);

      console.log(rolePerms);
      console.log(rolePermIds);

      setPermissions((prevPermissions) =>
        prevPermissions.map((perm) => ({
          ...perm,
          active: rolePermIds.includes(perm.permission_id),
          changed: false,
        }))
      );
    } catch (e) {
      console.log("Error fetching role permissions: " + e);
    }
  };

  const handlePermissionChange = (perm: Permission) => {
    setPermissions((prev) => {
      return prev.map((p) => {
        if (p.permission_id === perm.permission_id) {
          return { ...p, active: !p.active, changed: !p.changed };
        } else {
          return p;
        }
      });
    });
  };

  const handleCreateRole = async () => {
    const newRole = await createRole(nameInput);

    console.log(newRole);

    setRoles((prev) => {
      return [...prev, newRole];
    });

    setRoleCreated(true);
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) {
      console.log("No role selected");
      return;
    }
    setRoles((prev) => {
      return prev.filter((e) => {
        return e.role_id !== selectedRole?.role_id;
      });
    });
    await deleteRole(selectedRole?.role_id);
    setSelectedRole(null);
  };

  const handleNameInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNameInput(event.currentTarget.value);
  };

  return (
    <div className="container-lg">
      <div>
        <Modal
          id="addRole"
          title="Create Role"
          backdrop="static"
          keyboard="false"
          close={!roleCreated}
          body={
            <>
              {!roleCreated && (
                <form>
                  <div className="mb-3">
                    <label htmlFor="enterRoleName" className="form-label">
                      Role Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="enterRoleName"
                      aria-describedby="roleHelp"
                      onChange={handleNameInputChange}
                      value={nameInput}
                    />
                    <div id="roleHelp" className="form-text">
                      Enter the name for the new role.
                    </div>
                  </div>
                </form>
              )}
              {roleCreated && <p>New role successfully created!</p>}
            </>
          }
          footer={
            <>
              {!roleCreated && (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleCreateRole}
                >
                  Submit
                </button>
              )}
              {roleCreated && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setRoleCreated(false)}
                >
                  Close
                </button>
              )}
            </>
          }
        ></Modal>
      </div>
      <PageHeader>Manage Permissions</PageHeader>
      <hr></hr>
      <div className="row">
        <div className="col-4">
          <div className="row">
            <div className="col-6">
              <h2>Roles</h2>
            </div>
            <div className="col">
              <button
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#addRole"
                onClick={() => {
                  setNameInput("");
                }}
              >
                <i className="fa fa-plus"></i> Create New Role
              </button>
            </div>
          </div>
          <RoleListGroup
            items={roles}
            onSelectItem={handleSelectRole}
          ></RoleListGroup>
        </div>
        <div
          className="col p-2 bg-body-tertiary rounded overflow-y-auto"
          style={{ height: "400px", minHeight: "400px", maxHeight: "400px" }}
        >
          <div className="row mt-2">
            <div className="col-7">
              <h2>Permissions</h2>
            </div>
            <div className="col">
              <button
                className="btn btn-danger me-2"
                onClick={handleDeleteRole}
                disabled={!selectedRole}
              >
                Delete Role <i className="fa fa-trash"></i>
              </button>
              <button
                className="btn btn-primary"
                disabled={!selectedRole}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
          <hr></hr>
          {!selectedRole && (
            <p className="text-center">
              Select roles from the list on the left to edit their permissions.
            </p>
          )}
          {selectedRole &&
            permissions.map((e) => {
              return (
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={e.active}
                    onChange={() => handlePermissionChange(e)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    <p className={e.changed ? "text-primary-emphasis" : ""}>
                      {e.title}
                    </p>
                  </label>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;
