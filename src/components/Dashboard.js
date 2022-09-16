import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function Dashboard() {
  const [userData, setUserData] = useState(useContext(UserContext).data);
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout");
    logout();
  };
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {" "}
      <p>DASHBOARD</p>
      {userData ? (
        <div>
          <img alt={userData.profilepicture} src={userData.profilepicture} />
          <p>Username : {userData.username}</p>
          <p>Email : {userData.email}</p>
          <p>Bio : {userData.bio}</p>
          <br />
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            View Profile
          </button>
        </div>
      ) : null}
    </div>
  );
}
