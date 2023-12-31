import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/authentication/sign-in");
  }, [navigate]);

  return null;
}

export default SignOut;
