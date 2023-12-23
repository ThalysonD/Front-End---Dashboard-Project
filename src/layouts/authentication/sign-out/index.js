import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthHeaders } from "services/authService";

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    clearAuthHeaders();
    navigate("/authentication/sign-in");
  }, [navigate]);

  return null;
}

export default SignOut;
