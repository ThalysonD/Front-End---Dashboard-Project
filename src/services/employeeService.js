import axios from "axios";
import BASE_URL from "./apiConfig";

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
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error("Acesso negado. Verifique suas credenciais e tente novamente.");
      } else if (status === 404) {
        throw new Error("Recurso não encontrado. Verifique a URL e tente novamente.");
      } else if (status === 400) {
        throw new Error("Dados inválidos. Verifique as informações fornecidas.");
      }
      throw new Error("Erro ao cadastrar funcionário. Tente novamente mais tarde.");
    }
    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão e tente novamente.");
    }
    throw error;
  }
};

const fetchEmployees = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/funcionario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error("Acesso negado. Verifique suas credenciais e tente novamente.");
      } else if (status === 404) {
        throw new Error("Recurso não encontrado. Verifique a URL e tente novamente.");
      }
      throw new Error("Erro ao buscar funcionários. Tente novamente mais tarde.");
    }
    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão e tente novamente.");
    }
    throw error;
  }
};

export { registerEmployee, fetchEmployees };
