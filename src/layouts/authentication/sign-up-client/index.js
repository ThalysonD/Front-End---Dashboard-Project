import React, { useState } from "react";
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

function CoverClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    const clientData = {
      nome: name,
      email: email,
      telefone: phone,
      cpf: cpf,
      senha: password,
      id: 0,
    };

    try {
      await registerClient(clientData);
      setIsSuccess(true);
      setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setCpf("");
        setPassword("");
      }, 1000);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.message);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    }
  };

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
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Phone"
                variant="standard"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="CPF"
                variant="standard"
                fullWidth
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          opacity: 0.5,
                          marginLeft: "-35px",
                          transition: "transform 0.3s ease",
                        }}
                        style={{
                          transform: showPassword ? "rotate(0deg)" : "rotate(180deg)",
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            {successMessage && (
              <MDBox my={2}>
                <MDTypography variant="body2" color="success">
                  {successMessage}
                </MDTypography>
              </MDBox>
            )}
            {errorMessage && (
              <MDBox my={2}>
                <MDTypography variant="body2" color="error">
                  {errorMessage}
                </MDTypography>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                fullWidth
                type="submit"
                color={isError ? "error" : isSuccess ? "success" : "info"}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : isError ? (
                    <ErrorIcon color="error" />
                  ) : isSuccess ? (
                    <CheckIcon />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={isSubmitting}
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
