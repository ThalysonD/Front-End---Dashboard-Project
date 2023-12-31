import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { registerClient } from "services/clientService";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

const initialState = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  password: "",
  errorMessage: "",
  showPassword: false,
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
    default:
      return state;
  }
}

function CustomInput({ label, type, value, onChange }) {
  return (
    <MDBox mb={2}>
      <MDInput
        type={type}
        label={label}
        variant="standard"
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

function CoverClient() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (field) => (e) => {
    dispatch({ type: "SET_FIELD", field, value: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "SUBMIT" });
    const clientData = {
      nome: state.name,
      email: state.email,
      telefone: state.phone,
      cpf: state.cpf,
      senha: state.password,
      id: 0,
    };

    try {
      await registerClient(clientData);
      dispatch({ type: "SUCCESS" });
    } catch (error) {
      dispatch({ type: "ERROR", message: error.message });
    }
  };

  const handleTogglePasswordVisibility = () => {
    dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" });
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
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <CustomInput
              label="Name"
              type="text"
              value={state.name}
              onChange={handleChange("name")}
            />
            <CustomInput
              label="Email"
              type="email"
              value={state.email}
              onChange={handleChange("email")}
            />
            <CustomInput
              label="Phone"
              type="text"
              value={state.phone}
              onChange={handleChange("phone")}
            />
            <CustomInput label="CPF" type="text" value={state.cpf} onChange={handleChange("cpf")} />
            <TextField
              type={state.showPassword ? "text" : "password"}
              label="Password"
              variant="standard"
              fullWidth
              value={state.password}
              onChange={handleChange("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{
                        opacity: 0.5,
                        marginLeft: "-35px",
                        transition: "transform 0.3s ease",
                        transform: state.showPassword ? "rotate(0deg)" : "rotate(180deg)",
                      }}
                    >
                      {state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {state.isError && (
              <MDBox my={2}>
                <MDTypography variant="body2" color="error">
                  {state.errorMessage}
                </MDTypography>
              </MDBox>
            )}
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
                Sign Up
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default CoverClient;
