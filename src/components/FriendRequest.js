import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import "./FriendRequest.css";

const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

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

  const userId = getUserIDFromToken(cookies.token);

  // Fetch the friend request list from the backend
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = () => {
    fetch(
      `https://odin-book-api-production.up.railway.app/request-list/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        setFriendRequests(data);
      })
      .catch((err) => {
        console.log("Error retrieving posts:", err);
      });
  };

  // Accept friend request
  const acceptFriendRequest = (friendRequestId) => {
    fetch(`https://odin-book-api-production.up.railway.app/accept-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        friendRequestId: friendRequestId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        // Refresh the friend request list
        fetchFriendRequests();
        localStorage.removeItem("isRequestSent");
      })
      .catch((err) => {
        console.log("Error accepting friend request:", err);
      });
  };

  const declineFriendRequest = (friendRequestId) => {
    fetch(`https://odin-book-api-production.up.railway.app/decline-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        friendRequestId: friendRequestId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        // Refresh the friend request list
        localStorage.removeItem("isRequestSent");
        fetchFriendRequests();
        window.location.reload();
      })
      .catch((err) => {
        console.log("Error declining friend request:", err);
      });
  };

  return (
    <div className="request-container">
      <h2>Friend Requests</h2>
      <br />
      {friendRequests &&
      friendRequests.friendRequest &&
      friendRequests.friendRequest.length === 0 ? (
        <p>No friend requests.</p>
      ) : (
        <ul>
          {friendRequests &&
            friendRequests.friendRequest &&
            friendRequests.friendRequest.map((request) => (
              <li key={request._id}>
                <span className="sender-name">{request.senderName}</span> has
                sent you a friend request.
                <p
                  className="view-button"
                  onClick={() => navigate(`/profile/${request.sender}`)}
                >
                  View profile
                </p>
                <button
                  className="accept-button"
                  onClick={() => acceptFriendRequest(request._id)}
                >
                  Accept
                </button>
                <button
                  className="decline-button"
                  onClick={() => declineFriendRequest(request._id)}
                >
                  Decline Request
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequest;
