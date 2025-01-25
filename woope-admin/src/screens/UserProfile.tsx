import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import { getUserByID } from "../api/community";
import { getOrganizationById } from "../api/organizations";

function UserProfile() {
  const { userId } = useParams(); // Retrieve the 'id' parameter from the URL
  const [userOrg, setUserOrg] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const userFirstName = userInfo ? userInfo.first_name : null;
  const userLastName = userInfo ? userInfo.last_name : null;
  const userFullName = userLastName + ", " + userFirstName;
  const userEmail = userInfo ? userInfo.email : null;
  const userPhoneNumber = userInfo ? userInfo.phone_number : null;
  const userCreatedAt = userInfo ? userInfo.created_at : null;
  const userAdminsOrg = userInfo ? userInfo.admins_org : null;
  const userRole = userInfo ? userInfo.name : null;
  const userDOB = userInfo ? userInfo.date_of_birth : null;
  const orgName = userOrg ? userOrg.name : null;

  useEffect(() => {
    fetchUser();
    fetchOrganization();
  }, [userId, userAdminsOrg]);


  const fetchUser = async() => {
    try{
      const user = userId ? await getUserByID(userId) : null;
      const userInfo = user["user"];
      setUserInfo(userInfo[0]);
    }
    catch(e){
      console.error('Error fetching user information: ' + e);
    }
  }

  const fetchOrganization = async() => {
    try{
      const org = userAdminsOrg 
        ? await getOrganizationById(userAdminsOrg)
        : null;
      setUserOrg(org[0]);
    }
    catch(e){
      console.error('Error fetching organization: ' + e);
    }
  }

  const formatDate = (date: string) => {
    try{
      if(!date){return "";}
      const values = date.split('-');
      const year = values[0];
      const month = values[1];
      const day = values[2].slice(0,2);
      return month + '/' + day + '/' + year;
    }
    catch(e){
      console.log(e);
      return "";
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
            <dd>{formatDate(userCreatedAt)}</dd>
          </div>
          <div className="col-6">
            <dt>Date of Birth: </dt>
            <dd>{formatDate(userDOB)}</dd>
          </div>
        </div>
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
      </div>
      <h2 className="pt-5">Posts</h2>
    </div>
  );
}

export default UserProfile
