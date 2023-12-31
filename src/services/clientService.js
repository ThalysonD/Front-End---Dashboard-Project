import axios from "axios";
import BASE_URL from "./apiConfig";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }
  return token;
};

const axiosHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

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

const registerCliente = async (clientData) => {
  try {
    const response = await axios.post(`${BASE_URL}/cliente`, clientData, axiosHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const fetchClientes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cliente`, axiosHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getProfile = async (clienteId) => {
  try {
    const response = await axios.get(`${BASE_URL}/cliente/${clienteId}`, axiosHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (userData, userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/cliente/${userId}`, userData, axiosHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteCliente = async (userId) => {
  try {
    await axios.delete(`${BASE_URL}/cliente/${userId}`, axiosHeaders());
  } catch (error) {
    handleApiError(error);
  }
};

export { registerCliente, fetchClientes, getProfile, updateProfile, deleteCliente };
