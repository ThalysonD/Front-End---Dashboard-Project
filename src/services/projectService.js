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

const fetchProjects = async (pageNumber = 0, pageSize = 10) => {
  return apiRequest({
    method: "get",
    url: "/projeto",
    params: { page: pageNumber, size: pageSize },
  });
};

const findProjectById = async (projectId) => {
  return apiRequest({
    method: "get",
    url: `/projeto/${projectId}`,
  });
};

const deleteProject = async (projectId) => {
  return apiRequest({
    method: "delete",
    url: `/projeto/${projectId}`,
  });
};

const updateProject = async (projectId, projectData) => {
  return apiRequest({
    method: "put",
    url: `/projeto/${projectId}`,
    data: projectData,
  });
};

export { fetchProjects, findProjectById, deleteProject, updateProject };
