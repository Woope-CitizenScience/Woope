import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import { getPosts, searchPosts, updatePost, deletePost } from "../api/posts";
import Button from "../components/Button";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";

const PostManager = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<string[][]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");

  const tableHeaders = ["ID", "User", "Content", "Actions"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      if (res) {
        setPosts(res);
        setSearchResults(
          res.map((post: any) => [
            "" + post.post_id,
            post.user_id.toString(),
            post.content,
            <>
              <button
                className="me-2 btn btn-primary"
                onClick={() => handleEditPost(post)}
                data-bs-toggle="modal"
                data-bs-target="#editPostModal"
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeletePost(post)}
                data-bs-toggle="modal"
                data-bs-target="#deletePostModal"
              >
                Delete
              </button>
            </>,
          ])
        );
      }
    } catch (e) {
      console.log(e);
      setSearchResults([]);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await searchPosts(searchInput);
      setSearchResults(
        res.map((post: any) => [
          "" + post.post_id,
          post.user_id.toString(),
          post.content,
          <>
            <button
              className="me-2 btn btn-primary"
              onClick={() => handleEditPost(post)}
              data-bs-toggle="modal"
              data-bs-target="#editPostModal"
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeletePost(post)}
              data-bs-toggle="modal"
              data-bs-target="#deletePostModal"
            >
              Delete
            </button>
          </>,
        ])
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setEditContent(post.content);
  };

  const handleDeletePost = (post: any) => {
    setSelectedPost(post);
  };

  const confirmEditPost = async () => {
    try {
      await updatePost(selectedPost.post_id, editContent);
      fetchPosts();
      alert("Post updated successfully.");
    } catch (e) {
      console.error("Error updating post:", e);
    }
  };

  const confirmDeletePost = async () => {
    try {
      await deletePost(selectedPost.post_id);
      fetchPosts();
      alert("Post deleted successfully.");
    } catch (e) {
      console.error("Error deleting post:", e);
    }
  };

  return (
    <div className="container-lg">
      {/* Edit Post Modal */}
      <Modal
        id="editPostModal"
        title="Edit Post"
        body={
          <>
            <textarea
              cols={40}
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            ></textarea>
          </>
        }
        footer={
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmEditPost}
              data-bs-dismiss="modal"
            >
              Save Changes
            </button>
          </>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        id="deletePostModal"
        title="Confirm Delete"
        body={<p>Are you sure you want to delete this post?</p>}
        footer={
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDeletePost}
              data-bs-dismiss="modal"
            >
              Delete
            </button>
          </>
        }
      />

      <PageHeader>Post Manager</PageHeader>
      <hr></hr>
      <div className="row mb-3">
        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Posts By Content"
          />
        </div>
        <div className="col-sm-3">
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      <Table headers={tableHeaders} rows={searchResults} />
    </div>
  );
};

export default PostManager;
