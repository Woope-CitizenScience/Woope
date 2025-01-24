import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import { getUserByID } from "../api/community";

function UserProfile() {
  const { id } = useParams(); // Retrieve the 'id' parameter from the URL
  const [userInfo, setUserInfo] = useState<any>(null);
  const userFirstName = userInfo ? userInfo.first_name : null;
  const userLastName = userInfo ? userInfo.last_name : null;
  const userFullName = userLastName + ", " + userFirstName;
  const userEmail = userInfo ? userInfo.email : null;
  const userPhoneNumber = userInfo ? userInfo.phone_number : null;
  const userCreatedAt = userInfo ? userInfo.created_at : null;
  const userAdminsOrg = userInfo ? userInfo.admins_org : null;
  const userRole = userInfo ? userInfo.role_id : null;
  const userDOB = userInfo ? userInfo.date_of_birth : null;

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async() => {
    try{
      const user = id ? await getUserByID(id) : null;
      const userInfo = user["user"];
      setUserInfo(userInfo[0]);
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <div>
      <img src="https://picsum.photos/100" className="pe-3 float-start" alt="Profile Picture"></img>
      <h1 className="display-1">{userFullName}</h1>
      <h2 className="pt-5">Summary</h2>
      <div className="grid p-2">
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
            <dd>{userCreatedAt}</dd>
          </div>
          <div className="col-6">
            <dt>Date of Birth: </dt>
            <dd>{userDOB}</dd>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <dt>Role: </dt>
            <dd>{userRole}</dd>
          </div>
          <div className="col-6">
            <dt>Organization: </dt>
            <dd>{userAdminsOrg ? userAdminsOrg : "N/A"}</dd>
          </div>
        </div>
      </div>
      <h2 className="pt-5">Posts</h2>
    </div>
  );
}

export default UserProfile
