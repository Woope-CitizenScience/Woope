import { useEffect, useState } from "react";
import { Organization } from "../interfaces/Organization";
import { useParams } from "react-router-dom";
import { getOrganizationById } from "../api/organizations";

const OrgProfile = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const { id } = useParams();
  const orgName = organization ? organization.name : null;
  const tagline = organization ? organization.tagline : null;
  const description = organization ? organization.text_description : null;
  const createdAt = organization ? organization.created_at : null;

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    const res = await getOrganizationById("" + id);
    console.log(res);
    setOrganization(res[0]);
  };

  return (
    <>
      <h1 className="display-1">{orgName}</h1>
      <hr></hr>
      <dt>Tagline:</dt>
      <dd>{tagline}</dd>
      <dt>Description:</dt>
      <dd>{description}</dd>
      <dt>Created at:</dt>
      <dd>{createdAt}</dd>
    </>
  );
};

export default OrgProfile;
