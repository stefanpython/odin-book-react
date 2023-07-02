import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import "./Post.css";
import PostCreate from "./PostCreate";
import PostsContext from "./PostsContext";
import DisplayComment from "./DisplayComment";
import Contacts from "./Contacts";
import jwtDecode from "jwt-decode";
import placeholderIcon from "../images/placeholder.png";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [profileData, setProfileData] = useState(null);

  // Display post when loggin in
  useEffect(() => {
    fetchPosts();
    fetchUserProfile();
  }, []);

  const fetchPosts = () => {
    fetch("https://odin-book-api-production.up.railway.app/posts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((err) => {
        console.log("Error retrieving posts:", err);
      });
  };

  // Extract user ID from token
  const getUserIDFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.log("Error decoding token:", error);
      return null;
    }
  };
  const loggedUserId = getUserIDFromToken(cookies.token);

  const fetchUserProfile = () => {
    fetch(
      `https://odin-book-api-production.up.railway.app/profile/${loggedUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching profile!");
        }
      })
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="post-div">
      <PostsContext.Provider value={{ posts, fetchPosts }}>
        <div className="post-contacts">
          <Contacts />
          {profileData && profileData.user.friends.length === 0 && (
            <p>No contacts added</p>
          )}
        </div>

        <PostCreate />

        <div className="post-container">
          {/* Render posts here */}
          {posts.map((post) => (
            <div className="post-content" key={post._id}>
              <div className="post-header">
                {post.userId && post.profilePhoto ? (
                  <img
                    src={`https://odin-book-api-production.up.railway.app/images/${post.profilePhoto}`}
                    alt="User Avatar"
                    className="avatar"
                  />
                ) : (
                  <img className="avatar" src={placeholderIcon} alt="Profile" />
                )}

                <div className="post-author-date">
                  <Link to={`/profile/${post.userId._id}`}>
                    <h6 className="post-author">{post.authorName}</h6>
                  </Link>

                  <p className="post-date">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {post.image && (
                <img
                  className="post-image"
                  src={`https://odin-book-api-production.up.railway.app/images/${post.image}`}
                  alt=""
                />
              )}
              <hr />

              <p>{post.content}</p>

              <DisplayComment postId={post} />
            </div>
          ))}
        </div>
      </PostsContext.Provider>

      <div className="posts-end">
        <p> No more posts </p>
      </div>
    </div>
  );
};

export default Posts;
