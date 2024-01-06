import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const EmployeePagination = ({ totalPages }) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const handleChange = (event, value) => {
    setPage(value);
    // Navega para a URL correspondente à nova página
    navigate(`/planner/funcionario?size=10&page=${value - 1}`);
  };

  // Calcula o número de páginas a serem exibidas
  const displayPages = totalPages > 9 ? 9 : totalPages;

  return (
    <Stack spacing={2}>
      <Pagination
        count={displayPages}
        page={page}
        onChange={handleChange}
        showFirstButton={totalPages > 9}
        showLastButton={totalPages > 9}
        color="primary"
      />
    </Stack>
  );
};

EmployeePagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
};

export default EmployeePagination;
