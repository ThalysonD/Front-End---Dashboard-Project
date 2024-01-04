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

const registerEmployee = async (employeeData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`${BASE_URL}/funcionario`, employeeData, {
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

const fetchEmployees = async (pageNumber = 0, pageSize = 10) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${BASE_URL}/funcionario?page=${pageNumber}&size=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getProfile = async (employeeId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/funcionario/${employeeId}`, {
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
    const response = await axios.put(`${BASE_URL}/funcionario/${userId}`, userData, {
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

const deleteEmployee = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    await axios.delete(`${BASE_URL}/funcionario/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

export { registerEmployee, fetchEmployees, getProfile, updateProfile, deleteEmployee };
