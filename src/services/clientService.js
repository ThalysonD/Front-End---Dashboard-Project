import axios from "axios";
import BASE_URL from "./apiConfig";

const handleApiError = (error) => {
  const status = error?.response?.status;
  const errorMessages = {
    401: "Acesso negado. Verifique suas credenciais e tente novamente.",
    403: "Acesso negado. Verifique suas credenciais e tente novamente.",
    404: "Recurso não encontrado. Verifique a URL e tente novamente.",
    400: "Dados inválidos. Verifique as informações fornecidas.",
  };

  throw new Error(errorMessages[status] || "Erro na operação. Tente novamente mais tarde.");
};

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }
  return { Authorization: `Bearer ${token}` };
};

const registerClient = async (clientData) => {
  try {
    const response = await axios.post(`${BASE_URL}/cliente`, clientData, {
      headers: {
        ...getTokenHeader(),
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const fetchClients = async (pageNumber = 0, pageSize = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/cliente?page=${pageNumber}&size=${pageSize}`, {
      headers: {
        ...getTokenHeader(),
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getProfile = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/cliente/${clientId}`, {
      headers: {
        ...getTokenHeader(),
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (clientData, clientId) => {
  try {
    const response = await axios.put(`${BASE_URL}/cliente/${clientId}`, clientData, {
      headers: {
        ...getTokenHeader(),
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteClient = async (clientId) => {
  try {
    await axios.delete(`${BASE_URL}/cliente/${clientId}`, {
      headers: {
        ...getTokenHeader(),
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

export { registerClient, fetchClients, getProfile, updateProfile, deleteClient };
