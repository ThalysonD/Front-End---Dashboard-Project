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
import ProjectsData from "layouts/tablesProjects/data/projectsTableData";
import { fetchProjects } from "services/projectService";

function TablesProjects() {
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects(currentPage);
        setProjects(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };
    getProjects();
  }, [currentPage]);

  const handleChangePage = (type, page) => {
    setCurrentPage(page);
  };

  const { columns, rows } = ProjectsData({ projects });

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
                  Tabela de Projetos
                </MDTypography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Icon>add</Icon>}
                  style={{ color: "white" }}
                >
                  Novo Projeto
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  currentPage={currentPage}
                  onChangePage={handleChangePage}
                  totalPages={totalPages}
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

export default TablesProjects;
