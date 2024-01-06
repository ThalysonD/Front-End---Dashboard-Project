import React from "react";
import { useState, useEffect } from "react";
// @mui material components
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
import EmployeePagination from "examples/Pagination/PaginationEmployee";
import { fetchEmployees } from "services/employeeService";

function Tables() {
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const { columns, rows } = authorsTableData({
    employees,
    totalPages,
  });

  useEffect(() => {
    return () => {
      setCurrentPage(0);
    };
  }, [setCurrentPage]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees();
        console.log(data.totalPages);
        setEmployees(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    };
    getEmployees();
  }, []);

  const handleChangePage = async (type, page) => {
    console.log("minha pagina sendo chamada");
    setCurrentPage(page);
    try {
      const data = await fetchEmployees(page); // Busca os dados da página selecionada
      setEmployees(data.content);
      setTotalPages(data.totalPages);
      console.log(`Dados da página ${page}:`, data.content); // Imprime os dados da página no console
    } catch (error) {
      console.error("Erro ao buscar dados da página:", error);
    }
  };

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
              {/* <MDBox pt={3}>
                <EmployeePagination totalPages={totalPages} onPageChange={handlePageChange} />
              </MDBox> */}
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
