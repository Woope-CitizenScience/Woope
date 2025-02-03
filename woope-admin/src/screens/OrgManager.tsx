import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import { searchUser } from "../api/community";
import Button from "../components/Button";
import { getOrganizations } from "../api/organizations";
import { Organization } from "../interfaces/Organization";

const OrgManager = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);
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

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(event.currentTarget.value);
  };

  return (
    <>
      <div className="container-lg">
        <h1 className="py-2">Organization Manager</h1>
        <form>
          <div className="row mb-3">
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                value={searchInput}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-sm-3">
              <Button onClick={handleSearch}>Search</Button>
              <Button className="ms-2" onClick={() => {}}>
                Create New
              </Button>
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
