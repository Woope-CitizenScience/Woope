import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByID, updateUserOrg, updateUserRole } from "../api/community";
import { getOrganizationById, getOrganizations } from "../api/organizations";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import Select from "../components/Select";
import { getRoles } from "../api/roles";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Retrieve the 'id' parameter from the URL
  const [userOrg, setUserOrg] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [orgs, setOrgs] = useState<any>([]);
  const [roles, setRoles] = useState<any>([]);
  const userFirstName = userInfo ? userInfo.first_name : null;
  const userLastName = userInfo ? userInfo.last_name : null;
  const userFullName = userLastName + ", " + userFirstName;
  const userEmail = userInfo ? userInfo.email : null;
  const userPhoneNumber = userInfo ? userInfo.phone_number : null;
  const userCreatedAt = userInfo ? userInfo.created_at : null;
  const userAdminsOrg = userInfo ? userInfo.admins_org : null;
  const userRole = userInfo ? userInfo.name : null;
  const userDOB = userInfo ? userInfo.date_of_birth : null;
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [orgName, setOrgName] = useState(""); //userOrg ? userOrg.name : null;
  const orgNames = orgs
    ? orgs.map((e: any) => {
        return e.name;
      })
    : [];
  const orgIds = orgs
    ? orgs.map((e: any) => {
        return e.org_id;
      })
    : [];
  const roleNames = roles
    ? roles.map((e: any) => {
        return e.name;
      })
    : [];
  const roleIds = roles
    ? roles.map((e: any) => {
        return e.role_id;
      })
    : [];

  useEffect(() => {
    fetchUser();
    fetchOrganization();
    fetchOrganizations();
    fetchRoles();
  }, [userId, userAdminsOrg]);

  const fetchUser = async () => {
    try {
      const user = userId ? await getUserByID(userId) : null;
      const userInfo = user["user"];
      setUserInfo(userInfo[0]);
    } catch (e) {
      console.error("Error fetching user information: " + e);
    }
  };

  const fetchOrganization = async () => {
    try {
      const org = userAdminsOrg
        ? await getOrganizationById(userAdminsOrg)
        : null;
      setUserOrg(org[0]);
      setOrgName(org[0].name);
    } catch (e) {
      console.error("Error fetching organization: " + e);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations();
      const orgList = res ? res : [];
      setOrgs(orgList);
    } catch (e) {
      console.error("Error fetching organizations: " + e);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      const roleList = res ? res : [];
      console.log(roleList);
      setRoles(roleList);
    } catch (e) {
      console.error("Error fetching roles: " + e);
    }
  };

  const handleChangeOrg = async () => {
    if (!selectedOrg) {
      alert("Please select an organization.");
    } else if (!userId) {
      alert("User not found");
    } else {
      await updateUserOrg(userId, selectedOrg);
      alert("User organization succesfully updated.");
    }
    await fetchOrganization();
  };

  const handleRemoveOrg = async () => {
    if (!userId) {
      alert("User not found");
    } else {
      await updateUserOrg(userId, null);
      alert("User no longer administrates any organizations");
    }
  };

  const handleChangeRole = async () => {
    if (!selectedRole) {
      alert("Please select a role.");
    } else if (!userId) {
      alert("User not found");
    } else {
      await updateUserRole(userId, selectedRole);
      alert("User role succesfully updated.");
    }
  };

  const formatDate = (date: string) => {
    try {
      if (!date) {
        return "";
      }
      const values = date.split("-");
      const year = values[0];
      const month = values[1];
      const day = values[2].slice(0, 2);
      return month + "/" + day + "/" + year;
    } catch (e) {
      console.log(e);
      return "";
    }
  };

  return (
    <div>
      <Modal
        id="updateOrgModal"
        title="Update Organization"
        body={
          <>
            <div className="row">
              <dt className="col">Current Organization: </dt>
              <dd className="col">{orgName ? orgName : "N/A"}</dd>
            </div>
            <div className="row pt-4">
              <dt className="col">Change to: </dt>
              <Select
                className="col form-select-sm"
                options={orgNames}
                values={orgIds}
                id="orgSelect"
                onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                  setSelectedOrg(e.currentTarget.value);
                }}
              ></Select>
            </div>
          </>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleRemoveOrg}
            >
              Remove Organization
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleChangeOrg}
            >
              Save changes
            </button>
          </>
        }
      />
      <Modal
        id="updateRoleModal"
        title="Update Roles"
        body={
          <>
            <div className="row">
              <dt className="col">Current Role: </dt>
              <dd className="col">{userRole}</dd>
            </div>
            <div className="row pt-4">
              <dt className="col">Change to: </dt>
              <Select
                className="col form-select-sm"
                options={roleNames}
                values={roleIds}
                id="roleSelect"
                onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                  setSelectedRole(e.currentTarget.value);
                }}
              ></Select>
            </div>
          </>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleChangeRole}
            >
              Save changes
            </button>
          </>
        }
      />
      <img
        src="https://picsum.photos/100"
        className="me-3 rounded float-start"
        alt="Profile Picture"
      ></img>
      <h1 className="display-1">{userFullName}</h1>
      <button
        type="button"
        className="mt-4 ms-2 btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#updateOrgModal"
      >
        Update Organization
      </button>
      <button
        type="button"
        className="mt-4 ms-2 btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#updateRoleModal"
      >
        Update Role
      </button>
      <h2 className="pt-5">Summary</h2>
      <div className="grid p-2">
        <div className="row">
          <div className="col-6">
            <dt>Role: </dt>
            <dd>{userRole}</dd>
          </div>
          <div className="col-6">
            <dt>Organization: </dt>
            <dd>{userAdminsOrg ? orgName : "N/A"}</dd>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <dt>Email: </dt>
            <dd>{userEmail}</dd>
          </div>
          <div className="col-6">
            <dt>Phone Number: </dt>
            <dd>{userPhoneNumber ? userPhoneNumber : "N/A"}</dd>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <dt>Profile Created: </dt>
            <dd>{formatDate(userCreatedAt)}</dd>
          </div>
          {/* <div className="col-6">
            <dt>Date of Birth: </dt>
            <dd>{formatDate(userDOB)}</dd>
          </div> */}
        </div>
      </div>
      {/* <h2 className="pt-5">Posts</h2> */}
    </div>
  );
}

export default UserProfile;
