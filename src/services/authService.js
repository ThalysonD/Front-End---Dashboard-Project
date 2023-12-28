import axios from "axios";
import BASE_URL from "./apiConfig";

const login = async (email, senha) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      senha,
    });

    const { token } = response.data;
    return { token };
  } catch (error) {
    let errorMessage = "Ocorreu um erro durante o login.";
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        errorMessage = "Acesso proibido. Verifique suas permissões.";
      } else if (status === 403) {
        errorMessage = "Credenciais inválidas. Por favor, tente novamente.";
      } else if (status === 404) {
        errorMessage = "Recurso não encontrado. Verifique a URL.";
      }
    } else if (error.request) {
      errorMessage = "Sem resposta do servidor.";
    } else {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
};

const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`);
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Erro ao atualizar token:", error.message);
    localStorage.removeItem("token");
    window.location.href = "/authentication/sign-in";
    throw error;
  }
};

const checkTokenValidity = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() >= exp * 1000) {
      return refreshToken();
    }
  }
};

export { login, refreshToken, checkTokenValidity };
