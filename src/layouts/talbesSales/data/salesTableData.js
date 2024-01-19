import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function SalesData({ sales }) {
  const navigate = useNavigate();

  const handleEditClick = (salesId) => {
    navigate(`/sales-profile/${salesId}`);
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const formatDate = (dateString) => {
    return dateString.split(" ")[0];
  };

  const Author = ({ name, email }) => (
    <MDBox display="flex" flexDirection="column" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  );

  Author.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const Job = ({ title = "Job Title", description = "Description" }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  Job.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  const columns = [
    { Header: "Descrição", accessor: "descricao", width: "45%", align: "left" },
    { Header: "Cliente", accessor: "author", align: "center" },
    { Header: "Valor", accessor: "valor", align: "center" },
    { Header: "Data da venda", accessor: "data", align: "center" },
    { Header: "Detalhes", accessor: "id", align: "center" },
  ];

  const rows = sales.map((sale) => ({
    author: sale.cliente ? <Author name={sale.cliente.nome} email={sale.cliente.email} /> : null,
    descricao: sale.descricao,
    cliente: (
      <MDTypography variant="caption">
        {sale.cliente?.nome || "Cliente não disponível"}
      </MDTypography>
    ),
    valor: <MDTypography variant="caption">{formatCurrency(sale.valor)}</MDTypography>,
    data: <MDTypography variant="caption">{formatDate(sale.data)}</MDTypography>,
    id: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
        onClick={() => handleEditClick(sale.id)}
      >
        Ver mais
      </MDTypography>
    ),
  }));

  return { columns, rows };
}

SalesData.propTypes = {
  sales: PropTypes.arrayOf(PropTypes.object).isRequired,
};
