import { useEffect, useState } from "react";
import { Organization } from "../interfaces/Organization";
import { useParams } from "react-router-dom";
import { getOrganizationById } from "../api/organizations";
import { ForumPost } from "../interfaces/Posts";
import { getPostsByOrgId } from "../api/posts";
import Post from "../components/Post";

const OrgProfile = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [postResults, setPostResults] = useState<ForumPost[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const { id } = useParams();
  const orgName = organization ? organization.name : null;
  const tagline = organization ? organization.tagline : null;
  const description = organization ? organization.text_description : null;
  const createdAt = organization ? organization.created_at : null;

  useEffect(() => {
    fetchOrganization();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts();
      setPostResults(
        posts.filter((post) =>
          post.content.toLowerCase().includes(searchInput.toLowerCase().trim())
        )
      );
    }, 300); // Delay filtering by 300ms to avoid excessive updates

    return () => clearTimeout(timeoutId);
  }, [searchInput, posts]);

  const fetchOrganization = async () => {
    try {
      const res = await getOrganizationById("" + id);
      setOrganization(res[0]);
    } catch (e) {
      console.log("Error fetching organization: " + e);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await getPostsByOrgId(Number(id));
      setPosts(res);
      // setPostResults(res);
    } catch (e) {
      console.log("Error fetching posts: " + e);
    }
  };

  const formatLocalDateTime = (date: string | null) => {
    if (!date) {
      return "N/A";
    }

    const formatDate =
      new Date(date).toLocaleDateString() +
      " " +
      new Date(date).toLocaleTimeString();

    return formatDate;
  };

  const handlePostSearch = () => {
    const res = posts.filter((post) =>
      post.content
        .toLowerCase()
        .trim()
        .includes(searchInput.toLowerCase().trim())
    );
    setPostResults(res);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchInput(value);

    // Automatically update filtered results
    const res = posts.filter((post) =>
      post.content.toLowerCase().includes(value.toLowerCase().trim())
    );
    setPostResults(res);
  };

  const handlePostStatusChange = (postId: number) => {
    setPostResults((prevPosts) =>
      prevPosts.map((post) =>
        post.post_id === postId ? { ...post, is_active: !post.is_active } : post
      )
    );
  };

  return (
    <>
      <h1 className="display-1">{orgName}</h1>
      <h2 className="pt-4">Summary</h2>
      <hr></hr>
      <dt>Tagline:</dt>
      <dd>{tagline}</dd>
      <dt>Description:</dt>
      <dd>{description}</dd>
      <dt>Created at:</dt>
      <dd>{formatLocalDateTime(createdAt)}</dd>
      <h2 className="pt-4">Posts</h2>
      <hr></hr>
      <div className="py-3 row">
        <div className="col-6">
          <input
            type="text"
            className="form-control"
            value={searchInput}
            onChange={handleInputChange}
            placeholder={`Search ${orgName}'s Posts by Content`}
          ></input>
        </div>
        {/* <div className="col-6">
          <button className="btn btn-primary" onClick={handlePostSearch}>
            Search
          </button>
        </div> */}
      </div>
      {postResults.map(
        ({
          post_id,
          user_name,
          content,
          created_at,
          likes_count,
          is_active,
        }: ForumPost) => (
          <Post
            postId={post_id}
            userName={user_name}
            content={content}
            createdAt={created_at}
            likeCount={likes_count}
            isActive={is_active}
          />
        )
      )}
      {posts.length !== 0 && postResults.length === 0 && (
        <p className="py-4">{`No results for "${searchInput}"`}</p>
      )}
      {posts.length === 0 && (
        <p className="py-4">{`Organization has no posts.`}</p>
      )}
    </>
  );
};

export default OrgProfile;
