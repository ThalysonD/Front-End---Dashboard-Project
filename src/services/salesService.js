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

const fetchSales = async (pageNumber = 0, pageSize = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/venda?page=${pageNumber}&size=${pageSize}`, {
      headers: {
        ...getTokenHeader(),
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const registerSale = async (saleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/venda`, saleData, {
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

const fetchClients = async (searchTerm = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/cliente?search=${searchTerm}`, {
      headers: {
        ...getTokenHeader(),
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export { fetchSales, registerSale, fetchClients };
