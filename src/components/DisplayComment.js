import React, { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import PostsContext from "./PostsContext";
import "./DisplayComment.css";

const DisplayComment = ({ postId }) => {
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const { fetchPosts } = useContext(PostsContext);
  const [cookies] = useCookies(["token"]);

  // Display/hide comments
  const toggleCommentDisplay = () => {
    setCommentVisible(!isCommentVisible);
  };

  const handleCommentInputChange = (event) => {
    setCommentContent(event.target.value);
  };

  // Handle adding comment
  const postComment = () => {
    fetch(
      `https://odin-book-api-production.up.railway.app/${postId._id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error posting comment");
        }
      })
      .then((data) => {
        console.log("Comment posted successfully:", data);
        setCommentContent("");
        fetchPosts();
      })
      .catch((error) => {
        console.log("Error posting comment:", error);
      });
  };

  // Handle adding like
  const addLike = () => {
    fetch(
      `https://odin-book-api-production.up.railway.app/${postId._id}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error addling like");
        }
      })
      .then((data) => {
        console.log("Like added successfully:", data);
        fetchPosts();
      })
      .catch((error) => {
        console.log("Error adding like:", error);
      });
  };

  // Add comment pressing Enter key instead of button
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      postComment();
    }
  };

  return (
    <div>
      <div className="like-icon-container">
        <span className="like-count">{postId.likeCount} </span>
        <img className="like-icon" src="/like.png" alt="like icon" />
      </div>
      <div className="commentsBtnContainer">
        <p className="comments-btn" onClick={toggleCommentDisplay}>
          {postId.comments.length} Comments
        </p>
      </div>

      <hr />
      <div className="post-buttons">
        <button className="like-btn" onClick={addLike}>
          {postId.likeCount > 0 ? "Unlike" : "Like"}
        </button>

        <button className="comment-btn" onClick={toggleCommentDisplay}>
          Comment
        </button>
      </div>

      {isCommentVisible && <hr />}

      {/* Input for new comment */}
      {isCommentVisible && (
        <div className="comment-input">
          <textarea
            className="create-input"
            id="comment-content"
            name="comment-content"
            cols="66"
            rows="2"
            placeholder="Write a comment..."
            value={commentContent}
            onChange={handleCommentInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      {isCommentVisible && (
        <div className="comment-container">
          {postId.comments
            .slice()
            .reverse()
            .map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-avatar">
                  <img
                    src="/placeholder.png"
                    alt="User Avatar"
                    className="avatar"
                  />
                </div>
                {/* {console.log("comment Id:", comment)} */}

                <div className="comment-content">
                  <p className="author">{comment.authorName}</p>
                  <p className="content">{comment.content}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DisplayComment;
