import { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import PostsContext from "./PostsContext";
import "./PostCreate.css";

const PostCreate = () => {
  const [cookies] = useCookies(["token"]);
  const [post, setPost] = useState({ content: "", image: null }); // Add image state
  const { fetchPosts } = useContext(PostsContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("content", post.content);
    formData.append("image", post.image); // Append image to the form data

    fetch("https://odin-book-api-production.up.railway.app/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        setPost({ content: "", image: null }); // Reset content and image states
        fetchPosts();
      })
      .catch((error) => {
        console.error("Error creating post", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setPost((prevPost) => ({
      ...prevPost,
      image: file,
    }));
  };

  return (
    <div className="create-container">
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <textarea
            className="create-input"
            id="content"
            name="content"
            cols="66"
            rows="3"
            placeholder="What's on your mind?"
            value={post.content}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image" className="file-input-label">
            Choose Image
          </label>
          <div className="file-input-container">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
            />
            <span className="file-input-text">No file chosen</span>
          </div>
        </div>

        <div className="button-container">
          <button className="createpost-btn" type="submit">
            Post
          </button>
        </div>
        <hr />
      </form>
    </div>
  );
};

export default PostCreate;
