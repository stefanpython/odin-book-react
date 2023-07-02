import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import PostsContext from "./PostsContext";
import "./EditProfile.css";

const EditProfile = () => {
  const { userId } = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [cookies] = useCookies(["token"]);
  const { fetchPosts, toggleEditForm } = useContext(PostsContext);

  useEffect(() => {
    fetch(`https://odin-book-api-production.up.railway.app/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
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
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setEmail(data.user.email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId, cookies.token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setProfilePhoto(file);
  };

  const updateProfile = (e) => {
    e.preventDefault();

    // Construct the form data to be sent
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("image", profilePhoto);

    // Make a PUT request to update the profile
    fetch(`https://odin-book-api-production.up.railway.app/${userId}/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile updated successfully!", data);
        fetchPosts();
        toggleEditForm();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const cancelEdit = () => {
    toggleEditForm();
    // closeModal();
  };

  return (
    <div className="edit-container">
      <br />
      <form onSubmit={updateProfile}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="profilePhoto">Profile Photo:</label>
          <input type="file" id="profilePhoto" onChange={handleFileChange} />
        </div>
        <button type="submit">Save</button>
        <button className="cancel-edit-button" onClick={cancelEdit}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
