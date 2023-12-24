import axios from "axios";

const API_URL = "https://gestao-app-08b3423b86e1.herokuapp.com/planner/funcionario";

const registerEmployee = async (employeeData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(API_URL, employeeData, {
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

export { registerEmployee };