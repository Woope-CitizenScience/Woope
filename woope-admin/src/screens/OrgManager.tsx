import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { createSessionStorage, useNavigate } from "react-router-dom";
import { searchUser } from "../api/community";
import Button from "../components/Button";
import { createOrganization, getOrganizations } from "../api/organizations";
import { Organization } from "../interfaces/Organization";
import Modal from "../components/Modal";

const OrgManager = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);
  const [newOrgName, setNewOrgName] = useState<string>();
  const [newOrgTagline, setNewOrgTagline] = useState<string>();
  const [newOrgDesc, setNewOrgDesc] = useState<string>();
  // const findByOptions = ["Name", "Email", "Role", "Organization"];
  // const logicOptions = ["starts with", "contains", "is", "is not"];
  const tableHeaders = ["ID", "Name", "Tagline"];

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSearch = async () => {
    const res = organizations.filter((org: Organization) => {
      return org.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    const orgList = res.map((org: Organization) => {
      return ["" + org.org_id, org.name, org.tagline];
    });
    setSearchResults(orgList);
  };

  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations();
      if (res) {
        setOrganizations(res);
        const orgList = res.map((org: Organization) => {
          return ["" + org.org_id, org.name, org.tagline];
        });
        setSearchResults(orgList);
      }
    } catch (e) {
      console.log(e);
      setSearchResults([]);
    }
  };

  const handleOpenModal = () => {
    setNewOrgName("");
    setNewOrgTagline("");
    setNewOrgDesc("");
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
      } else {
        alert("Something went wrong. No organizations was created.");
      }
    } catch (e) {
      console.error("Error creating new organization: " + e);
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
          id="createOrgModal"
          title="Create New Organization"
          body={
            <>
              <div className="row">
                <dt className="col-2">Name: </dt>
                <input
                  className="col-8 ms-5"
                  value={newOrgName}
                  onChange={handleNameInputChange}
                ></input>
              </div>
              <div className="row pt-4">
                <dt className="col-2">Tagline: </dt>
                <input
                  className="col-8 ms-5"
                  value={newOrgTagline}
                  onChange={handleTaglineInputChange}
                ></input>
              </div>
              <hr></hr>
              <h2>Description</h2>
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
                data-bs-dismiss="modal"
              >
                Create
              </button>
            </>
          }
        ></Modal>
        <h1 className="py-2">Organization Manager</h1>
        <form>
          <div className="row mb-3">
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                value={searchInput}
                onChange={handleSearchInputChange}
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
