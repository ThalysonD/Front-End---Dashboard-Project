import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";

const ProjectsData = ({ projects }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (projectId) => {
    navigate(`/project-profile/${projectId}`);
  };

  const formatDate = (dateString) => dateString.split(" ")[0];

  const ClientInfo = ({ name, email }) => (
    <MDBox display="flex" flexDirection="column" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  );

  ClientInfo.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  Progress.propTypes = {
    color: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  };

  const determineProgressColor = (percentualConcluido) => {
    if (percentualConcluido < 50) return "error";
    if (percentualConcluido < 60) return "warning";
    if (percentualConcluido < 100) return "info";
    return "success";
  };

  const columns = [
    { Header: "Nome", accessor: "nome", align: "left" },
    { Header: "Cliente", accessor: "cliente", align: "center" },
    { Header: "Data da Venda", accessor: "dataVenda", align: "center" },
    { Header: "Data de Previsão", accessor: "dataPrevisao", align: "center" },
    { Header: "Percentual Concluído", accessor: "percentualConcluido", align: "center" },
    { Header: "Detalhes", accessor: "details", align: "center" },
  ];

  const rows = projects.map((project) => ({
    nome: project.nome,
    cliente: <ClientInfo name={project.cliente.nome} email={project.cliente.email} />,
    dataVenda: formatDate(project.dataVenda),
    dataPrevisao: formatDate(project.dataPrevisao),
    percentualConcluido: (
      <Progress
        color={determineProgressColor(project.percentualConcluido)}
        value={project.percentualConcluido}
      />
    ),
    details: (
      <MDTypography
        component="a"
        variant="caption"
        color="text"
        fontWeight="medium"
        onClick={() => handleDetailsClick(project.id)}
      >
        Ver mais
      </MDTypography>
    ),
  }));

  return { columns, rows };
};

ProjectsData.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProjectsData;
