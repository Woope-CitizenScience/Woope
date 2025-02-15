import Table from "../components/Table";
import Select from "../components/Select";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { searchUser } from "../api/community";

function UserManager() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);
  // const findByOptions = ["Name", "Email", "Role", "Organization"];
  // const logicOptions = ["starts with", "contains", "is", "is not"];
  const tableHeaders = ["ID", "Name", "Email", "Role", "Organization"];

  const handleSearch = async () => {
    try {
      const res = await searchUser(searchInput);
      if (res === "No users found") {
        setSearchResults([]);
      } else {
        // const users = res.map(
        //   (obj: { [s: string]: unknown } | ArrayLike<unknown>) =>
        //     Object.values(obj).map((value) => String(value))
        // );
        const users = res.map((user: any) => {
          return [
            <p className="pt-2">{user.user_id}</p>,
            /*<button
              type="button"
              className="btn btn-link"
              onClick={() => navigate(`/users/${user.user_id}`)}
            >
              {user.last_name + ", " + user.first_name}
            </button>,*/
            <div className="pt-2">
              <a
                href={`/users/${user.user_id}`}
              >{`${user.last_name}, ${user.first_name}`}</a>
            </div>,
            <p className="pt-2">{user.email}</p>,
            <p className="pt-2">{user.role}</p>,
            <p className="pt-2">{user.org}</p>,
          ];
        });
        setSearchResults(users);
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
        <h1 className="pb-4">User Administration</h1>
        <hr></hr>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <div className="row mb-3">
            {/* <label htmlFor="userSearch" className="col-sm col-form-label">
              Find by:
            </label> */}
            {/* <div className="col-sm-2">
              <Select options={findByOptions} id="userSearch" />
            </div> */}
            {/* <div className="col-sm-2">
              <Select options={logicOptions} id="searchLogic" />
            </div> */}
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search Users By Name"
              />
            </div>
            <div className="col-sm-3">
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
          <Table
            headers={tableHeaders}
            rows={searchResults}
            navigateTo="/users"
          />
        </form>
      </div>
    </>
  );
}

export default UserManager;
