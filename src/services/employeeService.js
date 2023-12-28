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

const getProfile = async (employeeId) => {
  const token = localStorage.getItem("token"); // Obter o token do localStorage

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/funcionario/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Adicionar o token ao cabeçalho de autorização
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
      throw new Error("Erro ao buscar funcionário. Tente novamente mais tarde.");
    }
    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão e tente novamente.");
    }
    throw error;
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
    // Tratar erros
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error("Acesso negado. Verifique suas credenciais e tente novamente.");
      } else if (status === 404) {
        throw new Error("Recurso não encontrado. Verifique a URL e tente novamente.");
      } else if (status === 400) {
        throw new Error("Dados inválidos. Verifique as informações fornecidas.");
      }
      throw new Error("Erro ao atualizar perfil. Tente novamente mais tarde.");
    }
    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão e tente novamente.");
    }
    throw error;
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
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error("Acesso negado. Verifique suas credenciais e tente novamente.");
      } else if (status === 404) {
        throw new Error("Recurso não encontrado. Verifique a URL e tente novamente.");
      }
      throw new Error("Erro ao deletar funcionário. Tente novamente mais tarde.");
    }
    if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão e tente novamente.");
    }
    throw error;
  }
};

export { registerEmployee, fetchEmployees, getProfile, updateProfile, deleteEmployee };
