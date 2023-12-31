import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Grid, IconButton, InputAdornment, CircularProgress, Switch } from "@mui/material";
import {
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Error as ErrorIcon,
} from "@mui/icons-material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import { login } from "services/authService";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import PropTypes from "prop-types";

const SocialIcon = ({ href, Icon }) => (
  <Grid item xs={2}>
    <MDTypography component="a" href={href} variant="body1" color="white">
      <Icon color="inherit" />
    </MDTypography>
  </Grid>
);

SocialIcon.propTypes = {
  href: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
};

const TIMEOUT_DURATION = 3000;

function Basic() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
    rememberMe: false,
    error: null,
    showPassword: false,
    isSubmitting: false,
    isError: false,
  });

  const handleInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const toggleState = (key) => {
    setState({ ...state, [key]: !state[key] });
  };

  const handleSignIn = async () => {
    setState({ ...state, isSubmitting: true });
    const result = await login(state.email, state.password);

    if (result.error) {
      setState({ ...state, error: result.error, isError: true, isSubmitting: false });
      setTimeout(() => {
        setState({ ...state, isError: false });
      }, TIMEOUT_DURATION);
    } else {
      localStorage.setItem("token", result.token);
      navigate("/dashboard");
    }
  };

  const isSignInDisabled = !state.email || !state.password;

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <SocialIcon href="#" Icon={FacebookIcon} />
            <SocialIcon href="#" Icon={GitHubIcon} />
            <SocialIcon href="#" Icon={GoogleIcon} />
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                name="email"
                value={state.email}
                onChange={handleInputChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={state.showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                name="password"
                value={state.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => toggleState("showPassword")}
                        edge="end"
                        sx={{ opacity: 0.5, transition: "transform 0.3s ease" }}
                        style={{
                          transform: state.showPassword ? "rotate(0deg)" : "rotate(180deg)",
                        }}
                      >
                        {state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={state.rememberMe} onChange={() => toggleState("rememberMe")} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={() => toggleState("rememberMe")}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color={state.isError ? "error" : "info"}
                fullWidth
                onClick={handleSignIn}
                disabled={isSignInDisabled || state.isSubmitting}
                endIcon={
                  state.isSubmitting ? (
                    <CircularProgress size={15} />
                  ) : state.isError ? (
                    <span style={{ position: "relative", top: "0px", left: "-4px" }}>
                      <ErrorIcon style={{ fontSize: "8px" }} />{" "}
                    </span>
                  ) : null
                }
              >
                Sign In
              </MDButton>
            </MDBox>

            {state.error && (
              <MDBox mt={2} mb={2} textAlign="center">
                <MDTypography variant="body2" color="error">
                  {state.error}
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
