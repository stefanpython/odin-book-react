import "./Profile.css";
import { useCookies } from "react-cookie";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PostsContext from "./PostsContext";
import DisplayComment from "./DisplayComment";
import EditProfile from "./EditProfile";
import jwtDecode from "jwt-decode";
import placeholderIcon from "../images/placeholder.png";

const Profile = () => {
  const [cookies] = useCookies(["token"]);
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  // Persist isRequestSent variable
  const [isRequestSent, setIsRequestSent] = useState(
    localStorage.getItem("isRequestSent") === "true"
  );

  useEffect(() => {
    if (isRequestSent) {
      localStorage.setItem("isRequestSent", "true");
    } else {
      localStorage.removeItem("isRequestSent");
    }
  }, [isRequestSent]);

  const toggleEditForm = () => {
    setIsEditOpen(!isEditOpen);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch(`https://odin-book-api-production.up.railway.app/profile/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
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

  // Send friend request
  const sendFriendRequest = () => {
    setIsRequestSent(true);

    fetch("https://odin-book-api-production.up.railway.app/send-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        senderId: loggedUserId,
        recipientId: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error sending friend request", error);
      });
  };

  // Check if the logged-in user and the profile user are friends
  const isFriend =
    profileData && profileData.user.friends.includes(loggedUserId);

  return (
    <div className="profile-container">
      <PostsContext.Provider value={{ fetchPosts, toggleEditForm }}>
        {profileData && (
          <div className="profile-info">
            <div className="profile-picture">
              {profileData.user.profilePhoto ? (
                profileData.user.profilePhoto.includes("168") ? (
                  <img
                    src={`https://odin-book-api-production.up.railway.app/images/${profileData.user.profilePhoto}`}
                    alt="Profile"
                  />
                ) : (
                  <img src={`${profileData.user.profilePhoto}`} alt="Profile" />
                )
              ) : (
                <img className="avatar" src={placeholderIcon} alt="Profile" />
              )}
            </div>

            {/* Profile details */}
            <div className="profile-details">
              <h1 className="name">
                {profileData.user.firstName} {profileData.user.lastName}
              </h1>

              {/* Edit profile button */}
              {profileData.user._id === loggedUserId ? (
                <button className="edit-button" onClick={toggleEditForm}>
                  Edit
                </button>
              ) : null}
            </div>

            {profileData && profileData.user._id !== loggedUserId && (
              <div className="send-request-button">
                {/* Send friend request button */}
                {!isRequestSent &&
                  !isFriend &&
                  !profileData.user.friends.some(
                    (friend) => friend._id === loggedUserId
                  ) && (
                    <button onClick={sendFriendRequest}>Send Request</button>
                  )}

                {isRequestSent && <button disabled>Request Sent</button>}
              </div>
            )}

            {isEditOpen && (
              <div className="edit-form-container">
                <EditProfile />
              </div>
            )}
          </div>
        )}

        <div className="profile-content">
          <div className="about-friends-container">
            {profileData && (
              <>
                <div className="about-section">
                  <h2>About</h2>
                  <p className="bio">Fullstack developer at Here and Now</p>
                  <p className="location">Here and now</p>
                  <p className="work">The Present Institute</p>
                </div>

                <div className="friends-section">
                  <h2>Friends</h2>
                  <span className="friends-number">
                    {profileData.user.friends.length} friends
                  </span>
                  <br /> <br />
                  <ul>
                    {profileData.user.friends.map((friend) => (
                      <li className="friends-list" key={friend._id}>
                        <img
                          className="friends-avatar"
                          src={`https://odin-book-api-production.up.railway.app/images/${friend.profilePhoto}`}
                          alt="Profile"
                          onClick={() => {
                            navigate(`/profile/${friend._id}`);
                            window.location.reload();
                          }}
                        />
                        <Link
                          to={`/profile/${friend._id}`}
                          onClick={() => {
                            navigate(`/profile/${friend._id}`);
                            window.location.reload();
                          }}
                        >
                          <p className="friend-name">
                            {friend.firstName} {friend.lastName}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {profileData && (
            <div className="posts-section">
              <h2>Posts</h2>

              {profileData.user.posts.length > 0 ? (
                profileData.user.posts
                  .map((post) => (
                    <div className="postProfile-content" key={post._id}>
                      {/* Post header */}
                      <div className="postProfile-header">
                        {profileData.user.profilePhoto ? (
                          profileData.user.profilePhoto.includes("168") ? (
                            <img
                              className="avatar"
                              src={`https://odin-book-api-production.up.railway.app/images/${profileData.user.profilePhoto}`}
                              alt="Profile"
                            />
                          ) : (
                            <img
                              className="avatar"
                              src={`${profileData.user.profilePhoto}`}
                              alt="Profile"
                            />
                          )
                        ) : (
                          <img
                            className="avatar"
                            src={placeholderIcon}
                            alt="Profile"
                          />
                        )}
                        <div className="postProfile-author-date">
                          <h6 className="postProfile-author">
                            {post.authorName}
                          </h6>
                          <p className="postProfile-date">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Post content */}
                      {post.image && (
                        <img
                          className="post-image"
                          src={`https://odin-book-api-production.up.railway.app/images/${post.image}`}
                          alt=""
                        />
                      )}
                      <hr />
                      <p>{post.content}</p>

                      {/* Display comments */}
                      <DisplayComment postId={post} />
                    </div>
                  ))
                  .reverse()
              ) : (
                <p>Nothing posted yet...</p>
              )}
            </div>
          )}
        </div>
      </PostsContext.Provider>
    </div>
  );
};

export default Profile;
