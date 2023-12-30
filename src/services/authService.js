import axios from "axios";
import BASE_URL from "./apiConfig";

// Função utilitária para manejar erros de API
const handleApiError = (error) => {
  let errorMessage = "Ocorreu um erro durante a operação.";
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        errorMessage = "Acesso proibido. Verifique suas permissões.";
        break;
      case 403:
        errorMessage = "Credenciais inválidas. Por favor, tente novamente.";
        break;
      case 404:
        errorMessage = "Recurso não encontrado. Verifique a URL.";
        break;
      default:
        break;
    }
  } else if (error.request) {
    errorMessage = "Sem resposta do servidor.";
  } else {
    errorMessage = error.message;
  }
  console.error(errorMessage);
  return { error: errorMessage };
};

const login = async (email, senha) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      senha,
    });

    const { token } = response.data;
    return { token };
  } catch (error) {
    return handleApiError(error);
  }
};

const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`);
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "/authentication/sign-in";
    return handleApiError(error);
  }
};

const checkTokenValidity = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now();
    const expTime = exp * 1000;

    const isTokenExpiringSoon = expTime - currentTime <= 15 * 60 * 1000;

    if (isTokenExpiringSoon) {
      return await refreshToken();
    }
  }
};

export { login, refreshToken, checkTokenValidity };
