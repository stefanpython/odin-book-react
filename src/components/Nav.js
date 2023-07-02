import { Navbar, Nav, Form, FormControl, Dropdown } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import jwtDecode from "jwt-decode";
import "./Nav.css";

import homebuttonIcon from "../images/home-button.png";
import notificationIcon from "../images/notification.png";
import placeholderIcon from "../images/placeholder.png";
import friendsIcon from "../images/friends.png";

const OdinbookNav = () => {
  const [profileData, setProfileData] = useState({});
  const [token, setToken] = useCookies(["token"]);
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [friendRequests, setFriendRequests] = useState(null);

  // Logout logic
  const handleLogout = () => {
    setToken("token", "", { path: "/" });
    navigate("/");
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

  const userId = getUserIDFromToken(token.token);

  // Redirect to my profile
  const handleMyProfileClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
      window.location.reload();
    } else {
      // Handle scenario when user ID is not available
      console.error("User ID is not available");
    }
  };

  // Fetch data to display user icon
  useEffect(() => {
    if (userId) {
      fetch(
        `https://odin-book-api-production.up.railway.app/profile/${userId}`,
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
    }
  }, [userId]);

  // Fetch list of all users
  useEffect(() => {
    fetch(`https://odin-book-api-production.up.railway.app/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching Users!");
        }
      })
      .then((data) => {
        setUserList(data.users);
        setSearchResults(data.users);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Update search query and filter users based on search query
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowDropdown(false);

    if (query.trim() === "") {
      setSearchResults(userList);
    } else {
      const filteredUsers = userList.filter((user) =>
        user.firstName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredUsers);
      setShowDropdown(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch the friend request list from the backend
  useEffect(() => {
    fetch(
      `https://odin-book-api-production.up.railway.app/request-list/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
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
  }, [token.token, userId]);

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand className="navbar-brand" href="/">
        <span className="odin">Odin</span>
        <span className="book">book</span>
      </Navbar.Brand>

      <Form inline="true" className="searchbar-form my-2 my-lg-0">
        <div className="searchbar-input">
          <i className="fas fa-search"></i>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {showDropdown && searchResults.length > 0 && (
          <div className="search-results-dropdown" ref={dropdownRef}>
            {searchResults.map((user) => (
              <div
                className="search-result-item"
                key={user._id}
                onClick={() => {
                  navigate(`/profile/${user._id}`);
                  window.location.reload();
                }}
              >
                {user.firstName} {user.lastName}
              </div>
            ))}
          </div>
        )}
      </Form>

      <Nav className="nav-links mr-auto mx-auto">
        <Nav.Link href="/">
          <div className="link-container">
            <img src={homebuttonIcon} className="nav-button" alt="home" />
            <span className="nav-text">Home</span>
          </div>
        </Nav.Link>
        <Nav.Link href={`/request-list/${userId}`}>
          <div className="link-container">
            {friendRequests && friendRequests.friendRequest.length !== 0 ? (
              <img
                src={notificationIcon}
                className="nav-button"
                alt="friends"
              />
            ) : (
              <img src={friendsIcon} className="nav-button" alt="friends" />
            )}

            <span className="nav-text">Friend Requests</span>
          </div>
        </Nav.Link>
      </Nav>

      <div className="buttons-container">
        <Dropdown className="mx-lg-4">
          <Dropdown.Toggle variant="outline" id="user-dropdown">
            {profileData.user && profileData.user.profilePhoto ? (
              <img
                className="nav-profilePhoto"
                src={`https://odin-book-api-production.up.railway.app/images/${profileData.user.profilePhoto}`}
                alt=""
              />
            ) : (
              <img src={placeholderIcon} alt="Profile" className="avatar" />
            )}
          </Dropdown.Toggle>

          {profileData.user && (
            <Dropdown.Menu className="dropdown-menu-right">
              <Dropdown.Item key={userId} onClick={handleMyProfileClick}>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          )}
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default OdinbookNav;
