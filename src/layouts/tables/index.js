import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import { fetchEmployees } from "services/employeeService";

function Tables() {
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    return () => {
      setCurrentPage(0);
    };
  }, [setCurrentPage]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees(currentPage);
        setEmployees(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };
    getEmployees();
  }, [currentPage]);

  const handleChangePage = async (type, page) => {
    setCurrentPage(page);
  };

  const { columns, rows } = authorsTableData({
    employees,
    totalPages,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Tabela de funcionários
                </MDTypography>
                <Button
                  variant="contained"
                  color="primary"
                  href="/authentication/sign-up/employees"
                  startIcon={<Icon>person_add</Icon>}
                  style={{ color: "white" }}
                >
                  Cadastrar funcionário
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  totalPages={totalPages}
                  isSorted={false}
                  currentPage={currentPage}
                  onChangePage={handleChangePage}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
