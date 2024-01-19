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

import DataTableClient from "examples/TablesClient/DataTableClient";

import salesTableData from "layouts/talbesSales/data/salesTableData";
import { fetchSales } from "services/salesService";

function TablesSales() {
  const [sales, setSales] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const getSales = async () => {
      try {
        const data = await fetchSales(currentPage);
        setSales(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      }
    };
    getSales();
  }, [currentPage]);

  const handleChangePage = (type, page) => {
    setCurrentPage(page);
  };

  const { columns, rows } = salesTableData({
    sales,
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
                  Tabela de vendas
                </MDTypography>
                <Button
                  variant="contained"
                  color="primary"
                  href="register/sale"
                  startIcon={<Icon>sell</Icon>}
                  style={{ color: "white" }}
                >
                  Cadastrar venda
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTableClient
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

export default TablesSales;
