// services/authService.js

import axios from "axios";

const API_URL = "https://gestao-app-08b3423b86e1.herokuapp.com/planner/auth";

const clearAuthHeaders = () => {
  axios.defaults.headers.common["Authorization"] = null;
  axios.defaults.headers.common["X-Auth-Expiration"] = null;
};

const setAuthHeaders = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["X-Auth-Expiration"] = getExpirationTimestampFromToken(token);
};

const getAuthHeaderToken = () => {
  const authorizationHeader = axios.defaults.headers.common["Authorization"];
  return authorizationHeader ? authorizationHeader.split("Bearer ")[1] : null;
};

const getExpirationTimestampFromToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const parsedToken = JSON.parse(atob(base64));
    return parsedToken.exp ? parsedToken.exp * 1000 : null;
  } catch (error) {
    console.error("Erro ao obter timestamp de expiração do token:", error);
    return null;
  }
};

const handleError = (error) => {
  const status = error.response ? error.response.status : null;

  if (status === 400) {
    console.error("Erro na solicitação:", error.response.data);
    if (status === 401) {
      console.error("Credenciais inválidas. Por favor, tente novamente.");
    } else if (status === 403) {
      console.error("Acesso proibido. Verifique suas permissões.");
    }
  } else if (status === 404) {
    throw new Error("Recurso não encontrado. Verifique a URL.");
  } else if (error.request) {
    console.error("Sem resposta do servidor:", error.request);
  } else {
    console.error("Erro ao configurar a solicitação:", error.message);
  }

  throw error;
};

const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      senha,
    });

    const { token } = response.data;
    setAuthHeaders(token);
    return token;
  } catch (error) {
    handleError(error);
  }
};

const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/refresh_token`, null);
    const { newToken } = response.data;
    setAuthHeaders(newToken);
    return newToken;
  } catch (error) {
    handleError(error);
  }
};

export {
  login,
  refreshToken,
  setAuthHeaders,
  getAuthHeaderToken,
  getExpirationTimestampFromToken,
  handleError,
  clearAuthHeaders,
};
