// side navbar having option data prepare and text analytics

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { Routess } from '../routes';
import { DvrOutlined, Home, LibraryBooksOutlined, Translate } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import HomePg from './home_pg/HomePg';
import DataPrepare from './data_prepare/DataPrepare';
import { colors } from '@mui/material';
import textanalysis from '../assets/textanalysis.png';
import dataprepare from '../assets/dataprepare.png'
import monitoringimg from '../assets/monitorinimg.png'
import './sidemenu.css'

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  marginTop:"46px",
  marginTop: "45px",
  background: "#001B48",
  color:"white",
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  marginTop:"46px",
  marginTop: "45px",
  background: "#001B48",
  color:"white",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  paddingRight: "14px",
  background: "transparent",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function SideMenu() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }} >
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
        {open === false ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              style={{ padding: "13px" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon className='listItem'/> : <ChevronLeftIcon className='listItem' />}
          </IconButton>
          )}
        </DrawerHeader>
        {/* <Divider /> */}
        <List className="drawerIcon" style={{padding:'0',display:'flex',flexDirection:'column',gap:'5px'}}>
          <ListItem
            component={Link}
            to={Routess.DataPrepare}
            className='listItem'
          >
            <ListItemIcon>
            <img src={dataprepare} style={{height:"23px"}}></img>
              {/* <LibraryBooksOutlined className='listItem'/> */}
            </ListItemIcon>
            <ListItemText primary={t("data-prepare")} />
          </ListItem>
          <ListItem
            component={Link}
            to={Routess.Summary}
            className='listItem'
          >
            <ListItemIcon>
              {/* <TranslateIcon style={{ color: "white" }} /> */}
              {/* <Translate className='listItem'/> */}
              <img src={textanalysis}  style={{height:"23px"}}></img>
            </ListItemIcon>
            <ListItemText primary={t("text-analytics")} />
          </ListItem>
          {/* {admin === "Employee.Admin" ? <> */}
            <ListItem
              component={Link}
              to={Routess.LogServer}
            //   onClick={() => setSelectedMenuItem("monitoring")}
              className='listItem'
            >
              <ListItemIcon>
                <img src={monitoringimg} style={{height:"23px"}}></img>
              </ListItemIcon> 
              <ListItemText primary={t("monitoring")} />
            </ListItem>
          {/* </>
            : ("")
          } */}
        </List>
        <Divider />
      </Drawer>
      <Box component="main"  sx={{
          flexGrow: 1,
          p: 3,
          width: '100vw',
          margin: '0',
          padding: '1rem',
          textAlign: 'center',
        }}>
      {/* <main className={classes.content}> */}
        {location.pathname === Routess.Home && <HomePg/>}
        {/* {location.pathname === Routess.DataPrepare && <DataPrepare/>} */}
        {/* {renderMainbyTabs && (
          <> */}
            {/* <ThemeProvider theme={selectedTheme === 'dark' ? darkTheme : lightTheme}> */}
            {/* <MainbyTabs /> */}
            {/* </ThemeProvider> */}
          {/* </>
        )} */}
        {/* {admin === "Employee.Admin" ? <> */}
          {/* {monitoringTabs && ( */}
            {/* <> */}
              {/* <ThemeProvider theme={selectedTheme === 'dark' ? darkTheme : lightTheme}> */}
              {/* <MonitoringTab /> */}
              {/* </ThemeProvider> */}
            {/* </>
          )} */}
        {/* </>
         : ('')
        }  */}

        {/* {location.pathname === Routess.Monitoring && <MonitoringTab />} */}
        {/* {location.pathname === Routess.Search && (
          <SearchTxt />
        )} */}
      {/* </main> */}
      </Box>
    </Box>
  );
}
