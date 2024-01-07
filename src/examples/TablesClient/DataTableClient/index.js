import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import DataTableClientHeadCell from "examples/TablesClient/DataTableClient/DataTableClientHeadCell";
import DataTableClientBodyCell from "examples/TablesClient/DataTableClient/DataTableClientBodyCell";

function DataTableClient({
  canSearch,
  showTotalEntries,
  table,
  totalPages,
  pagination,
  isSorted,
  noEndBorder,
  onChangePage,
  currentPage,
}) {
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, globalFilter },
  } = tableInstance;

  const [search, setSearch] = useState(globalFilter);
  const onSearchChange = useAsyncDebounce((value) => {
    tableInstance.setGlobalFilter(value || undefined);
  }, 100);

  const setSortedValue = (column) => {
    if (isSorted && column.isSorted) {
      return column.isSortedDesc ? "desc" : "asc";
    } else if (isSorted) {
      return "none";
    }
    return false;
  };

  // Função atualizada para renderizar a paginação
  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const maxPagesToShow = 5;
    let rangeStart = Math.floor(currentPage / maxPagesToShow) * maxPagesToShow;
    let rangeEnd = Math.min(rangeStart + maxPagesToShow, totalPages);

    const paginationItems = [];
    for (let i = rangeStart; i < rangeEnd; i++) {
      paginationItems.push(
        <MDPagination
          item
          key={i}
          onClick={() => onChangePage("page", i)}
          active={currentPage === i}
        >
          {i + 1}
        </MDPagination>
      );
    }
    return paginationItems;
  };

  // Função para avançar o intervalo de páginas
  const onNextRange = () => {
    const newPage = Math.floor(currentPage / 5) * 5 + 5;
    if (newPage < totalPages) {
      onChangePage("page", newPage);
    }
  };

  // Função para retroceder o intervalo de páginas
  const onPrevRange = () => {
    const rangeSize = 5;
    let newPage = currentPage - (currentPage % rangeSize) - 1;
    if (newPage < 0) {
      newPage = 0;
    }
    onChangePage("page", newPage);
  };

  const isNextButtonDisabled = () => {
    const maxPageInCurrentRange = Math.floor(currentPage / 5) * 5 + 4;
    return maxPageInCurrentRange >= totalPages - 1;
  };

  // Restante do seu componente...

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {canSearch && (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <MDBox width="12rem" ml="auto">
            <MDInput
              placeholder="Search..."
              value={search}
              size="small"
              fullWidth
              onChange={({ currentTarget }) => {
                setSearch(currentTarget.value);
                onSearchChange(currentTarget.value);
              }}
            />
          </MDBox>
        </MDBox>
      )}
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableClientHeadCell
                  key={idx}
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                </DataTableClientHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <TableRow key={key} {...row.getRowProps()}>
                {row?.cells?.length
                  ? row?.cells?.map((cell, idx) => (
                      <DataTableClientBodyCell
                        key={idx}
                        noBorder={noEndBorder && page.length - 1 === key}
                        align={cell.column.align ? cell.column.align : "left"}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </DataTableClientBodyCell>
                    ))
                  : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          p={!showTotalEntries && totalPages === 1 ? 0 : 3}
        >
          {showTotalEntries && (
            <MDBox mb={{ xs: 3, sm: 0 }}>
              <MDTypography variant="button" color="secondary" fontWeight="regular">
                Showing {pageIndex * 10 + 1} to {Math.min((pageIndex + 1) * 10, table.rows.length)}{" "}
                of {table.rows.length} entries
              </MDTypography>
            </MDBox>
          )}
          <MDPagination
            variant={pagination.variant ? pagination.variant : "gradient"}
            color={pagination.color ? pagination.color : "info"}
          >
            {totalPages > 5 && (
              <MDPagination item onClick={onPrevRange} disabled={currentPage < 5}>
                <Icon>chevron_left</Icon>
              </MDPagination>
            )}
            {renderPagination()}
            {totalPages > 5 && (
              <MDPagination item onClick={onNextRange} disabled={isNextButtonDisabled()}>
                <Icon>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        </MDBox>
      )}
    </TableContainer>
  );
}

DataTableClient.defaultProps = {
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

DataTableClient.propTypes = {
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  totalPages: PropTypes.number,
  onChangePage: PropTypes.func,
  currentPage: PropTypes.number,
};

export default DataTableClient;
