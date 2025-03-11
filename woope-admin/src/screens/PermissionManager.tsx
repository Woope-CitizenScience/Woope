import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Checkbox from "../components/Checkbox";
import Modal from "../components/Modal";
import ListGroup from "../components/ListGroup";

interface Permission {
  id: number;
  name: string;
}

const PermissionManager = () => {
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 1, name: "Permission 1" },
    { id: 2, name: "Permission 2" },
    { id: 3, name: "Permission 3" },
  ]);
  const [roleNames, setRolesNames] = useState<string[]>([
    "User (Default)",
    "Moderator",
  ]);
  const [nameInput, setNameInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roleCreated, setRoleCreated] = useState(false);

  const rolePermissions = {
    1: [1, 2],
    2: [2, 3],
  };

  useEffect(() => {}, [selectedRole]);

  const handleCreateRole = () => {
    setRolesNames((prev) => {
      return [...prev, nameInput];
    });
    setRoleCreated(true);
  };

  const handleDeleteRole = () => {
    setRolesNames((prev) => {
      return prev.filter((e) => {
        return e !== selectedRole;
      });
    });
    setSelectedRole("");
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
          <ListGroup
            items={roleNames}
            onSelectItem={setSelectedRole}
          ></ListGroup>
        </div>
        <div className="col p-2 bg-body-tertiary rounded overflow-y-auto">
          <div className="row mt-2">
            <div className="col-7">
              <h2>Permissions</h2>
            </div>
            <div className="col">
              <button
                className="btn btn-danger me-2"
                onClick={handleDeleteRole}
                disabled={selectedRole === ""}
              >
                Delete Role <i className="fa fa-trash"></i>
              </button>
              <button
                className="btn btn-primary"
                disabled={selectedRole === ""}
              >
                Save Changes
              </button>
            </div>
          </div>
          <hr></hr>
          {selectedRole !== "" &&
            permissions.map((e) => {
              return <Checkbox id={"" + e.id}>{e.name}</Checkbox>;
            })}
          {selectedRole === "" && (
            <p className="text-center">
              Select roles from the list on the left to edit their permissions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;
