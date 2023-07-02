import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import "./Nav.css";

const Contacts = () => {
  const [cookies] = useCookies(["token"]);
  const [profileData, setProfileData] = useState(null);

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

  // Extract ID from token
  const userId = getUserIDFromToken(cookies.token);

  useEffect(() => {
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
  }, [userId]);

  return (
    <div className="contacts-container">
      <h4>Contacts</h4>
      {profileData &&
        profileData.user &&
        profileData.user.friends.map((friend) => (
          <li key={friend._id}>
            <Link to={`/profile/${friend._id}`} className="contacts-item">
              <img
                className="contacts-avatar"
                src={`https://odin-book-api-production.up.railway.app/images/${friend.profilePhoto}`}
                alt="avatar"
              />
              {friend.firstName} {friend.lastName}
            </Link>
          </li>
        ))}
    </div>
  );
};

export default Contacts;
