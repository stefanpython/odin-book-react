import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import OdinbookNav from "./Nav";
import Signup from "../components/Signup";
import Login from "../components/Login";
import "../App.css";
import Posts from "./Post";
import Profile from "./Profile";
import FriendRequest from "./FriendRequest";

const RouterSwitch = () => {
  const [cookies] = useCookies(["token"]);

  return (
    <BrowserRouter>
      {cookies.token && <OdinbookNav />}

      <Routes>
        <Route
          path="/"
          element={cookies.token ? <Posts /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/request-list/:userId" element={<FriendRequest />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterSwitch;
