import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Button,
  Popover,
  Hidden,
  Link as MuiLink,
} from "@mui/material";
import { ExitToApp, MoreVert, OpenInNew, Settings } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { authProvider } from "../auth/AuthProvider";
import { ProfileNavigationCard } from "./ProfileNavigationCard";
import { Link } from "react-router-dom";
import onelogicalogo from '../../assets/LOGO_FINAL 1.png'
import MobileDrawer from "../mobileview/Menu";
import { Routess } from "../../routes";
import "../home_pg/homePage.css";

const PREFIX = 'Header';

const classes = {
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  toolbar: `${PREFIX}-toolbar`,
  title: `${PREFIX}-title`,
  topheader: `${PREFIX}-topheader`,
  userid: `${PREFIX}-userid`,
  small: `${PREFIX}-small`,
  menulist: `${PREFIX}-menulist`,
};

// Styled component for consistent styling
const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    border: "2px solid red",
    "& .MuiAppBar-root": {
      marginTop: "43px",
    },
  },
  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },
  [`& .${classes.toolbar}`]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  [`& .${classes.title}`]: {
    flexGrow: 1,
    alignSelf: "flex-end",
  },
  [`& .${classes.topheader}`]: {
    minHeight: "45px",
    backgroundColor: '#001B48',
    paddingLeft: "13px",
  },
  [`& .${classes.userid}`]: {
    width: "100%",
    display: "flex",
    justifyContent: "end",
  },
  [`& .${classes.small}`]: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginLeft: "15px",
  },
  [`& .${classes.menulist}`]: {
    marginLeft: "15px",
  },
}));

const ITEM_HEIGHT = 30;

export default function Header() {
  const [user, setUser] = useState(null); // State to store user information
  const [profileNavigationAnchor, setProfileNavigationAnchor] = useState(); // State to manage profile menu anchor
  const dispatch = useDispatch(); // Redux hook for dispatching actions
  const accountInfo = useSelector((state) => state.accountInfo); // Access account information from Redux store
  const userImageUrl = localStorage.getItem('profileImageUrl')
  const profileImageUrl = localStorage.getItem('profileImageUrl') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  return (
    <Root>
      {/* App bar with top header */}
      <AppBar position="fixed">
        <Toolbar className={classes.topheader}>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <Hidden mdUp>
              {/* Mobile drawer for smaller screens */}
              <MobileDrawer />
            </Hidden>
            
            {/* Logo and title with link to home page */}
            <MuiLink
              component={Link}
              to={Routess.Home}
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img className="tlogo" src={onelogicalogo} alt="Logo" />
              <Typography variant="h6" className="Ctitle">Onelogica</Typography>
            </MuiLink>
          </div>

          {/* User profile and avatar */}
          <div className={classes.userid}>
            <span
              style={{ cursor: "pointer" }}
              role="button"
              onClick={(ev) => setProfileNavigationAnchor(ev.currentTarget)} // Open profile menu on avatar click
            >
              <Avatar className={classes.small} sx={{

              border: '3px solid #001a4b',
              boxShadow: '0px 4px 10px rgb(0, 0, 34, 0.3)',
              backgroundColor: 'white'
            }} src={profileImageUrl} /> {/* User avatar */}
            </span>
            {/* Profile navigation popover */}
            <Popover
              elevation={2}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              open={Boolean(profileNavigationAnchor)}
              anchorEl={profileNavigationAnchor}
              onClose={() => setProfileNavigationAnchor(undefined)} // Close popover
            >
              <ProfileNavigationCard info={accountInfo} /> {/* Display profile navigation */}
            </Popover>   
          </div>
        </Toolbar>
      </AppBar>
    </Root>
  );
}
