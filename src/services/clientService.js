import axios from "axios";
import BASE_URL from "./apiConfig";

// Função utilitária para manejar erros de API
const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
      case 403:
        throw new Error("Acesso negado. Verifique suas credenciais e tente novamente.");
      case 404:
        throw new Error("Recurso não encontrado. Verifique a URL e tente novamente.");
      case 400:
        throw new Error("Dados inválidos. Verifique as informações fornecidas.");
      default:
        throw new Error("Erro na operação. Tente novamente mais tarde.");
    }
  }
  if (error.request) {
    throw new Error("Sem resposta do servidor. Verifique sua conexão e tente novamente.");
  }
  throw error;
};

// As funções a seguir foram ajustadas para usar a função utilitária handleApiError

const registerCliente = async (clientData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${BASE_URL}/cliente`, clientData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const fetchClientes = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/cliente`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getProfile = async (clienteId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/cliente/${clienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (userData, userId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    const response = await axios.put(`${BASE_URL}/cliente/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteCliente = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    await axios.delete(`${BASE_URL}/cliente/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

export { registerCliente, fetchClientes, getProfile, updateProfile, deleteCliente };
