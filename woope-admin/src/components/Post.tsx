import { deletePost, restorePost, softDeletePost } from "../api/posts";

interface Props {
  postId: number;
  userName: string;
  content: string;
  createdAt: string;
  likeCount: string;
  isActive: boolean;
}

const Post = ({
  postId,
  userName,
  content,
  createdAt,
  likeCount,
  isActive,
}: Props) => {
  const handleRestorePost = async () => {
    try {
      await restorePost(postId);
    } catch (e) {
      console.error("Error soft deleting post: " + e);
    }
  };

  const handleSoftDeletePost = async () => {
    try {
      await softDeletePost(postId);
    } catch (e) {
      console.error("Error soft deleting post: " + e);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId);
    } catch (e) {
      console.error("Error deleting post: " + e);
    }
  };

  return (
    <div className="card my-4">
      {/* <div className="card-header">Featured</div> */}
      <div className="card-body">
        {/* <img
          src="https://picsum.photos/100"
          className="me-3 rounded float-start"
          alt="Profile Picture"
        ></img> */}
        <h5>{userName}</h5>
        <p className={isActive ? "" : "text-decoration-line-through"}>
          {content}
        </p>
      </div>
      <div className="card-footer">
        <div className="row">
          <div className="col-2">
            <p className="fw-light col">{`Likes: ${likeCount}`}</p>
          </div>
          <div className="col-2">
            <p className="fw-light col">
              {new Date(createdAt).toLocaleDateString() +
                " " +
                new Date(createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="col-8 text-end">
            <button
              className="btn btn-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions
            </button>
            <ul className="dropdown-menu">
              {isActive && (
                <li>
                  <a className="dropdown-item" onClick={handleSoftDeletePost}>
                    Soft Delete
                  </a>
                </li>
              )}
              {!isActive && (
                <li>
                  <a className="dropdown-item" onClick={handleRestorePost}>
                    Restore
                  </a>
                </li>
              )}
              <li>
                <a className="dropdown-item" onClick={handleDeletePost}>
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
