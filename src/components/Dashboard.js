import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("logout");
    logout();
  };
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {" "}
      <p>DASHBOARD</p>
    </div>
  );
}
