import React, { ReactNode, useEffect, useState } from "react";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
} from "../api/organizations";
import { Organization } from "../interfaces/Organization";
import Modal from "../components/Modal";

const OrgManager = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<ReactNode[][]>([]);
  const [newOrgName, setNewOrgName] = useState<string>();
  const [newOrgTagline, setNewOrgTagline] = useState<string>();
  const [newOrgDesc, setNewOrgDesc] = useState<string>();
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);
  // const [createOrgModal, setCreateOrgModal] = useState<boolean>(false);
  const tableHeaders = ["ID", "Name", "Tagline", "Actions"];

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    setSearchResults(mapOrgsToResults(organizations));
  }, [organizations]);

  const handleSearch = async () => {
    const res = organizations.filter((org: Organization) => {
      return org.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    // setOrganizations(res);
    setSearchResults(mapOrgsToResults(res));
  };

  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations();
      if (res) {
        setOrganizations(res);
      }
    } catch (e) {
      console.log(e);
      setSearchResults([]);
    }
  };

  const mapOrgsToResults = (orgs: Organization[]) => {
    const orgList = orgs.map((org: Organization) => {
      return [
        <p className="pt-2">{org.org_id}</p>,
        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate(`/organizations/${org.org_id}`)}
        >
          {org.name}
        </button>,
        <p className="pt-2">{org.tagline}</p>,
        <button
          type="button"
          className="btn btn-danger btn-small"
          data-bs-toggle="modal"
          data-bs-target="#deleteOrgModal"
          onClick={() => handleOpenDeleteModal(org.org_id)}
        >
          Delete
        </button>,
      ];
    });
    return orgList;
  };

  const handleOpenModal = () => {
    setNewOrgName("");
    setNewOrgTagline("");
    setNewOrgDesc("");
    // setCreateOrgModal((prev) => !prev);
  };

  const handleOpenDeleteModal = (orgId: number) => {
    const filteredOrg = organizations.filter((e) => {
      return e.org_id === orgId;
    });

    setOrgToDelete(filteredOrg[0]);
  };

  const handleCreateOrg = async () => {
    try {
      let res;
      if (newOrgName && newOrgTagline && newOrgDesc) {
        res = await createOrganization(newOrgName, newOrgTagline, newOrgDesc);
      }
      fetchOrganizations();
      if (res) {
        alert("New organization successfully created.");
        // $("#createOrgModal").modal("hide");
        // setCreateOrgModal(false);
      } else {
        alert("Something went wrong. No organization was created.");
      }
    } catch (e) {
      console.error("Error creating new organization: " + e);
    }
  };

  const handleDeleteOrg = async () => {
    try {
      setOrganizations((prevOrgs) =>
        prevOrgs.filter((org) => org.org_id !== orgToDelete?.org_id)
      );
      if (orgToDelete) {
        await deleteOrganization(orgToDelete.name);
      }
    } catch (e) {
      alert("Error deleteing organization.");
      console.log("Error deleting organization: " + e);
    }
  };

  const handleSearchInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.currentTarget.value);
  };

  const handleNameInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setNewOrgName(event.currentTarget.value);
  };

  const handleTaglineInputChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setNewOrgTagline(event.currentTarget.value);
  };

  const handleDescInputChange = (
    event: React.FormEvent<HTMLTextAreaElement>
  ) => {
    setNewOrgDesc(event.currentTarget.value);
  };

  return (
    <>
      <div className="container-lg">
        <Modal
          id="deleteOrgModal"
          title="Delete Organization?"
          body={
            <>
              <p>You are deleting the following organization:</p>
              <ul>
                <li>
                  <strong>Name:</strong> {orgToDelete?.name}
                </li>
                <li>
                  <strong>ID:</strong> {orgToDelete?.org_id}
                </li>
              </ul>
              <p>
                All data from this organization will be deleted permanently.
              </p>
              <p>Would you still like to proceed?</p>
            </>
          }
          footer={
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={handleDeleteOrg}
            >
              Confirm
            </button>
          }
        />
        <Modal
          id="createOrgModal"
          title="Create New Organization"
          body={
            <>
              <div className="row">
                <dt className="col-2">Name*: </dt>
                <input
                  className="col-8 ms-5"
                  value={newOrgName}
                  onChange={handleNameInputChange}
                ></input>
              </div>
              <div className="row pt-4">
                <dt className="col-2">Tagline*: </dt>
                <input
                  className="col-8 ms-5"
                  value={newOrgTagline}
                  onChange={handleTaglineInputChange}
                ></input>
              </div>
              <hr></hr>
              <h2>Description*</h2>
              <div className="row pt-4">
                <textarea
                  cols={40}
                  rows={5}
                  value={newOrgDesc}
                  onChange={handleDescInputChange}
                ></textarea>
              </div>
            </>
          }
          footer={
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateOrg}
                // data-bs-dismiss="modal"
              >
                Create
              </button>
            </>
          }
        ></Modal>
        <h1 className="pb-4">Organization Manager</h1>
        <hr></hr>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <div className="row mb-3">
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search Organizations By Name"
              />
            </div>
            <div className="col-sm-3">
              <Button onClick={handleSearch}>Search</Button>
              <button
                type="button"
                className="ms-2 btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createOrgModal"
                onClick={handleOpenModal}
              >
                Create New
              </button>
            </div>
          </div>
          <Table
            headers={tableHeaders}
            rows={searchResults}
            navigateTo="/organizations"
          />
        </form>
      </div>
    </>
  );
};

export default OrgManager;
