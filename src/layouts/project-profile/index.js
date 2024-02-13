import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import HeaderProjectProfile from "layouts/project-profile/Header/index";
import { findProjectById, updateProject, deleteProject } from "services/projectService";
import { fetchClients } from "services/clientService";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const ProjectProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [project, setProject] = useState({
    nome: "",
    clienteNome: "",
    email: "",
    descricao: "",
    dataVenda: dayjs(),
    dataPrevisao: dayjs(),
    dataEntrega: dayjs(),
    status: "",
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectData = await findProjectById(id);
        setProject({
          nome: projectData.nome,
          clienteNome: projectData.cliente.nome,
          email: projectData.cliente.email,
          descricao: projectData.descricao,
          dataVenda: projectData.dataVenda.split(" ")[0],
          dataPrevisao: projectData.dataPrevisao.split(" ")[0],
          dataEntrega: projectData.dataEntrega ? projectData.dataEntrega.split(" ")[0] : "",
          status: projectData.status,
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes do projeto:", error);
      }
    };
    fetchProjectData();
  }, [id]);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(id);
      navigate("/projects");
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      setIsError(true);
    }
  };

  const changeHandler = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (fieldName, newValue) => {
    setProject({ ...project, [fieldName]: newValue.format("DD/MM/YYYY") });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProject(id, project);
      setIsSuccess(true);
      setIsEditable(false);
      setTimeout(() => {
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      setIsError(true);
      console.error("Erro ao atualizar projeto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <HeaderProjectProfile name={project.nome || "Detalhes do Projeto"}>
        <MDBox
          component="form"
          role="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
          mt={2}
        >
          <MDInput
            type="text"
            label="Cliente"
            name="clienteNome"
            value={project.clienteNome}
            onChange={changeHandler}
            disabled={!isEditable}
            sx={{ mb: 2 }}
          />
          <MDInput
            type="text"
            label="Email"
            name="email"
            value={project.email}
            onChange={changeHandler}
            disabled={!isEditable}
            sx={{ mb: 2 }}
          />
          <MDInput
            type="text"
            label="Descrição"
            name="descricao"
            value={project.descricao}
            onChange={changeHandler}
            disabled={!isEditable}
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isEditable ? (
              <DatePicker
                label="Data da Venda"
                value={project.dataVenda ? dayjs(project.dataVenda, "DD/MM/YYYY") : null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                slotProps={{
                  textField: {
                    format: "DD/MM/YYYY",
                  },
                }}
                name="dataVenda"
                disabled={!isEditable}
                sx={{ marginBottom: 2 }}
              />
            ) : (
              <MDInput
                type="text"
                label="Data da Venda"
                value={project.dataVenda}
                disabled
                sx={{ mb: 2 }}
              />
            )}
            {isEditable ? (
              <DatePicker
                label="Data de Previsão"
                value={project.dataPrevisao ? dayjs(project.dataPrevisao, "DD/MM/YYYY") : null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                slotProps={{
                  textField: {
                    format: "DD/MM/YYYY",
                  },
                }}
                name="dataPrevisao"
                disabled={!isEditable}
                sx={{ marginBottom: 2 }}
              />
            ) : (
              <MDInput
                type="text"
                label="Data de Previsão"
                value={project.dataPrevisao}
                disabled
                sx={{ mb: 2 }}
              />
            )}
            {isEditable ? (
              <DatePicker
                label="Data de Entrega"
                value={project.dataEntrega ? dayjs(project.dataEntrega, "DD/MM/YYYY") : null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                slotProps={{
                  textField: {
                    format: "DD/MM/YYYY",
                  },
                }}
                name="dataEntrega"
                disabled={!isEditable}
                sx={{ marginBottom: 2 }}
              />
            ) : (
              <MDInput
                type="text"
                label="Data de Entrega"
                value={project.dataEntrega}
                disabled
                sx={{ mb: 2 }}
              />
            )}
          </LocalizationProvider>
          <MDInput
            type="text"
            label="Status"
            name="status"
            value={project.status}
            onChange={changeHandler}
            disabled={!isEditable}
            sx={{ mb: 2 }}
          />
          <MDBox mt={2} display="flex" justifyContent="space-between">
            <MDBox display="flex">
              <MDButton variant="gradient" color="info" onClick={handleEdit} disabled={isEditable}>
                Editar
              </MDButton>
              <MDButton
                variant="gradient"
                color="error"
                onClick={handleDeleteClick}
                style={{ marginLeft: "10px" }}
                disabled={isEditable}
              >
                Excluir
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color={isError ? "error" : isSuccess ? "success" : "info"}
              type="submit"
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={20} />
                ) : isError ? (
                  <ErrorIcon />
                ) : isSuccess ? (
                  <CheckIcon />
                ) : (
                  <SendIcon />
                )
              }
              disabled={!isEditable || isSubmitting}
            >
              Salvar Alterações
            </MDButton>
          </MDBox>
        </MDBox>
      </HeaderProjectProfile>
      <Footer />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja excluir este projeto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDeleteConfirmOpen(false)} color="info">
            Não
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="error" autoFocus>
            Sim
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProjectProfile;
