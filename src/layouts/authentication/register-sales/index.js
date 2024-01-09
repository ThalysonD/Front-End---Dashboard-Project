import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

import { fetchClients, registerSale } from "services/salesService";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const initialState = {
  clienteId: "",
  descricao: "",
  formaPagamento: "",
  parcelamento: "",
  statusPagamento: "",
  valor: "",
  clientes: [],
  isLoadingClientes: false,
  errorMessage: "",
  isSubmitting: false,
  isSuccess: false,
  isError: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SUBMIT":
      return { ...state, isSubmitting: true, isError: false, isSuccess: false };
    case "SUCCESS":
      return { ...initialState, isSuccess: true };
    case "ERROR":
      return { ...state, isError: true, errorMessage: action.message, isSubmitting: false };
    case "TOGGLE_PASSWORD_VISIBILITY":
      return { ...state, showPassword: !state.showPassword };
    case "RESET":
      return initialState;
    case "LOAD_CLIENTES_START":
      return { ...state, isLoadingClientes: true };
    case "LOAD_CLIENTES_SUCCESS":
      return { ...state, clientes: action.clientes, isLoadingClientes: false };
    case "LOAD_CLIENTES_ERROR":
      return { ...state, errorMessage: action.message, isLoadingClientes: false };
    default:
      return state;
  }
}

function CustomInput({ label, type, value, onChange, ...rest }) {
  return (
    <MDBox mb={2} fullWidth>
      <TextField
        {...rest}
        type={type}
        label={label}
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChange}
      />
    </MDBox>
  );
}

CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Componente CustomSelect para Forma de Pagamento e Status de Pagamento
function CustomSelect({ label, value, onChange, options }) {
  return (
    <MDBox mb={2} fullWidth>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange} label={label} sx={{ height: "50px" }}>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </MDBox>
  );
}

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function CoverSales() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  useEffect(() => {
    const loadClientes = async () => {
      dispatch({ type: "LOAD_CLIENTES_START" });
      try {
        const data = await fetchClients();
        dispatch({ type: "LOAD_CLIENTES_SUCCESS", clientes: data.content });
      } catch (error) {
        dispatch({ type: "LOAD_CLIENTES_ERROR", message: error.message });
      }
    };
    loadClientes();
  }, []);

  const handleChange = (field) => (e) => {
    dispatch({ type: "SET_FIELD", field, value: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    const formattedDate = dayjs(newValue).format("DD/MM/YYYY HH:mm");
    dispatch({ type: "SET_FIELD", field: "data", value: formattedDate });
  };

  const handleValorChange = (event) => {
    let value = event.target.value.replace(/\D/g, "");
    value = (value / 100).toFixed(2);
    value = value.replace(".", ",");
    dispatch({ type: "SET_FIELD", field: "valor", value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "SUBMIT" });

    // Encontrar o cliente pelo nome selecionado
    const clienteSelecionado = state.clientes.find((cliente) => cliente.nome === state.clienteNome);
    if (!clienteSelecionado) {
      dispatch({ type: "ERROR", message: "Cliente não encontrado" });
      return;
    }

    const saleData = {
      cliente: {
        id: clienteSelecionado.id,
      },
      data: state.data,
      descricao: state.descricao,
      formaPagamento: state.formaPagamento,
      parcelamento: parseInt(state.parcelamento),
      statusPagamento: state.statusPagamento,
      valor: parseFloat(state.valor.replace(",", ".")),
    };

    console.log("Dados da Venda: ", saleData);

    try {
      await registerSale(saleData);
      dispatch({ type: "SUCCESS" });
    } catch (error) {
      dispatch({ type: "ERROR", message: error.message });
    }
  };

  useEffect(() => {
    let timeout;
    if (state.isSuccess) {
      timeout = setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 1500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [state.isSuccess]);

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Junte-se a nós hoje
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Registre sua venda
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* Campo Cliente */}
            <CustomSelect
              label="Cliente"
              value={state.clienteNome}
              onChange={handleChange("clienteNome")}
              options={state.clientes.map((cliente) => cliente.nome)}
            />

            {/* Campo Descrição */}
            <CustomInput
              label="Descrição"
              type="text"
              value={state.descricao}
              onChange={handleChange("descricao")}
            />

            {/* Campo de Data da Venda */}
            <MDBox mb={2} fullWidth>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Data da Venda"
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                  />
                </LocalizationProvider>
              </FormControl>
            </MDBox>

            {/* Campo Forma de Pagamento */}
            <CustomSelect
              label="Forma de Pagamento"
              value={state.formaPagamento}
              onChange={handleChange("formaPagamento")}
              options={["Dinheiro", "Pix", "Cartão de Crédito", "Cartão de Débito"]}
              sx={{ marginBottom: 2 }} // Adicione esta linha para criar espaço
            />

            {/* Campo Parcelamento */}
            <CustomInput
              label="Parcelamento"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={state.parcelamento}
              onChange={handleChange("parcelamento")}
            />

            {/* Campo Status de Pagamento */}
            <CustomSelect
              label="Status do Pagamento"
              value={state.statusPagamento}
              onChange={handleChange("statusPagamento")}
              options={["Pagamento Pendente", "Pagamento Aprovado"]}
            />

            {/* Campo Valor */}
            <TextField
              label="Valor"
              value={state.valor}
              onChange={handleValorChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ fontSize: "0.875rem" }}>
                    R$
                  </InputAdornment>
                ),
              }}
            />

            {/* Botão de Registro */}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                fullWidth
                type="submit"
                color={state.isError ? "error" : state.isSuccess ? "success" : "info"}
                endIcon={
                  state.isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : state.isError ? (
                    <ErrorIcon color="error" />
                  ) : state.isSuccess ? (
                    <CheckIcon />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={state.isSubmitting}
              >
                Registrar Venda
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default CoverSales;
