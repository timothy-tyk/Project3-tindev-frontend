import React from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
export default function Questions() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      {" "}
      <p>Question</p>
    </div>
  );
}
