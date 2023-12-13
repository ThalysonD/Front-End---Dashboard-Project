import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpar dados de autenticação, como o token, do armazenamento local ou de onde estiver armazenado.
    localStorage.removeItem("token");

    // Redirecionar para a página de login.
    navigate("/authentication/sign-in");
  }, [navigate]);

  return null;
};

export default SignOut;
