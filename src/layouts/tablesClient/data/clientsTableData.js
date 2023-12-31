/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import { fetchClients } from "services/clientService";

import { useNavigate } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team5 from "assets/images/defaultPhoto.jpg";

export default function clientData() {
  const [clients, setclients] = useState([]);
  const navigate = useNavigate();

  const handleEditClick = (clientId) => {
    navigate(`/client-profile/${clientId}`);
  };

  useEffect(() => {
    const getclients = async () => {
      try {
        const data = await fetchClients();
        setclients(data.content);
      } catch (error) {
        console.error("Erro ao buscar clients:", error);
      }
    };
    getclients();
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

    rows: clients.map((client) => ({
      author: <Author image={team5} name={client.nome} email={client.email} />,
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
          onClick={() => handleEditClick(client.id)}
        >
          Ver mais
        </MDTypography>
      ),
    })),
  };
}
