import React from "react";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { useNavigate } from "react-router-dom";
import { Routess } from "../../routes";
import { authProvider } from "./AuthProvider";
import { Container, Grid, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import glamlogo from '../../assets/gl2.png';
import "./auth.css";

// Login Page usign azure AD

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="App">
      <AzureAD provider={authProvider}>
        {({ authenticationState, login, logout, accountInfo, error, getAccessToken }) => {
           {/* console.log("accountinfo",accountInfo) */}
          if (authenticationState === AuthenticationState.Authenticated) {
            dispatch({ type: "SET_ACCOUNT_INFO", payload: accountInfo });
            localStorage.setItem('accessToken', accountInfo.jwtIdToken);
            navigate(Routess.Home); // Navigate to the Home route
          }

          if (error) {
            console.error("Authentication error:", error);
          }

          return (
            <div className="containerL">
              <Container component="main" maxWidth="md" >
                <Grid container direction="column" alignItems="center" spacing={2} >
                  <Grid item>.
                    {/* Boot logo */}
                    <img className="logo-image" src={glamlogo} alt="Logo" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className="title-text">
                    Generative Language based Analytics and Maximization
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={login}
                      className="sign-in-button"
                    >
                      Sign In
                    </Button>
                  </Grid>
                </Grid>
              </Container>
              <div
                style={{
                  position: "fixed",
                  bottom: 0,
                  width: "60%",
                  padding: "10px 0",
                  zIndex: 999,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "15px", color: "white" }}>
                    Powered by Onelogica, ℗ Onelogica.
                  </p>
                </div>
              </div>
            </div>
          );
        }}
      </AzureAD>
    </div>
  );
}

export default SignIn;
