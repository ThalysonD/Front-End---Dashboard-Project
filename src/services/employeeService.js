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

const registerEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/funcionario`, employeeData, {
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

const fetchEmployees = async (pageNumber = 0, pageSize = 2) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/funcionario?page=${pageNumber}&size=${pageSize}`,
      {
        headers: {
          ...getTokenHeader(),
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getProfile = async (employeeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/funcionario/${employeeId}`, {
      headers: {
        ...getTokenHeader(),
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (userData, userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/funcionario/${userId}`, userData, {
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

const deleteEmployee = async (userId) => {
  try {
    await axios.delete(`${BASE_URL}/funcionario/${userId}`, {
      headers: {
        ...getTokenHeader(),
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

export { registerEmployee, fetchEmployees, getProfile, updateProfile, deleteEmployee };
