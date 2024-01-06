import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

import team5 from "assets/images/defaultPhoto.jpg";

export default function EmployeeData({ employees }) {
  const navigate = useNavigate();

  const handleEditClick = (employeeId) => {
    navigate(`/user-profile/${employeeId}`);
  };

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

  Author.propTypes = {
    image: PropTypes.string.isRequired,
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
    { Header: "Usuário", accessor: "author", width: "45%", align: "left" },
    { Header: "Função", accessor: "function", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Contratado em", accessor: "employed", align: "center" },
    { Header: "Ação", accessor: "action", align: "center" },
  ];

  const rows = employees.map((employee) => ({
    author: <Author image={team5} name={employee.nome} email={employee.email} />,
    function: <Job />,
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
        onClick={() => handleEditClick(employee.id)}
      >
        Ver mais
      </MDTypography>
    ),
  }));

  return { columns, rows };
}

EmployeeData.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
};
