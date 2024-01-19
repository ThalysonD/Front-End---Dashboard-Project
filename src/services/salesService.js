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

const apiRequest = async ({ method, url, data = null, params = null }) => {
  const headers = {
    ...getTokenHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      headers,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const fetchSales = async (pageNumber = 0, pageSize = 10) => {
  return apiRequest({
    method: "get",
    url: "/venda",
    params: { page: pageNumber, size: pageSize },
  });
};

const registerSale = async (saleData) => {
  return apiRequest({
    method: "post",
    url: "/venda",
    data: saleData,
  });
};

const fetchClients = async (searchTerm = "") => {
  return apiRequest({
    method: "get",
    url: "/cliente",
    params: { search: searchTerm },
  });
};

const findSaleById = async (saleId) => {
  return apiRequest({
    method: "get",
    url: `/venda/${saleId}`,
  });
};

const updateSale = async (saleId, saleData) => {
  return apiRequest({
    method: "put",
    url: `/venda/${saleId}`,
    data: saleData,
  });
};

const deleteSale = async (saleId) => {
  return apiRequest({
    method: "delete",
    url: `/venda/${saleId}`,
  });
};

export { fetchSales, registerSale, fetchClients, findSaleById, updateSale, deleteSale };
