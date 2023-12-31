/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import { fetchClientes } from "services/clientService";

import { useNavigate } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team5 from "assets/images/defaultPhoto.jpg";

export default function clienteData() {
  const [clientes, setclientes] = useState([]);
  const navigate = useNavigate();

  const handleEditClick = (clienteId) => {
    navigate(`/client-profile/${clienteId}`);
  };

  useEffect(() => {
    const getClientes = async () => {
      try {
        const data = await fetchClientes();
        setclientes(data.content);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    getClientes();
  }, []);

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Usuário", accessor: "author", width: "45%", align: "left" },
      { Header: "Função", accessor: "function", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Contratado em", accessor: "employed", align: "center" },
      { Header: "Ação", accessor: "action", align: "center" },
    ],

    rows: clientes.map((cliente) => ({
      author: <Author image={team5} name={cliente.nome} email={cliente.email} />,
      function: <Job title="Job Title" description="Description" />,
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      employed: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          23/04/18
        </MDTypography>
      ),
      action: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleEditClick(cliente.id)}
        >
          Ver mais
        </MDTypography>
      ),
    })),
  };
}
