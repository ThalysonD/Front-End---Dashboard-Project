import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  refreshToken,
  getAuthHeaderToken,
  getExpirationTimestampFromToken,
  clearAuthHeaders,
} from "services/authService";

function PrivateRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        clearAuthHeaders();
        navigate("/authentication/sign-in");
      }, 2 * 60 * 60 * 1000); // 2 horas (ajuste conforme necessário)
    };

    const checkAuthentication = async () => {
      const token = getAuthHeaderToken();

      if (!token) {
        navigate("/authentication/sign-in");
        return;
      }

      const expirationTimestamp = getExpirationTimestampFromToken(token);

      if (expirationTimestamp && expirationTimestamp < Date.now()) {
        try {
          await refreshToken();
        } catch (error) {
          clearAuthHeaders();
          navigate("/authentication/sign-in");
        }
      }
      resetInactivityTimer(); // Reset o temporizador ao acessar uma rota
    };

    checkAuthentication();

    // Adiciona event listeners para resetar o temporizador em atividades do usuário
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, [navigate]);

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
