import React, { useState } from 'react'; // Importing React and useState for managing component state
import Drawer from '@mui/material/Drawer'; // Drawer component for the sidebar
import IconButton from '@mui/material/IconButton'; // IconButton component for clickable icons
import List from '@mui/material/List'; // List component to display navigation items
import ListItem from '@mui/material/ListItem'; // ListItem component for individual items in the list
import ListItemIcon from '@mui/material/ListItemIcon'; // ListItemIcon component for icons in the list items
import ListItemText from '@mui/material/ListItemText'; // ListItemText component for text in the list items
import Divider from '@mui/material/Divider'; // Divider component for separating items
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for expanding/collapsing submenus
import { Menu } from '@mui/icons-material'; // Menu icon for opening the drawer
import textanalysisimg from '../../assets/ta.png'; // Importing images for menu items
import dataprepareimg from '../../assets/Vectordp.png';
import monitoringimg from '../../assets/monitoring.png';
import summary from "../../assets/summary.png";
import moderation from "../../assets/moderation.png";
import textinsight from "../../assets/textinsight.png";
import translate from "../../assets/translate.png";
import qna from "../../assets/qna.png";
import { styled, useTheme } from '@mui/system'; // styled for custom styling and useTheme for accessing theme
import { BrowserRouter as Router, Link } from 'react-router-dom'; // Router and Link for navigation
import { Routess } from '../../routes'; // Importing route paths
import { useTranslation } from 'react-i18next'; // For handling translations

const submenuBackground = '#c8c2c2'; // Background color for submenu items
const drawerWidth = 240; // Width of the drawer

// Styled ListItem for regular navigation items
const ListItemStyled = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'grey',
  },
}));

// Style for submenu items
const submenuItemStyle = {
  backgroundColor: submenuBackground,
  border: '1px solid grey',
  color: 'white',
};

// Styled ListItem for submenu items
const ListItemSubmenuStyled = styled(ListItem)(({ theme }) => ({
  ...submenuItemStyle,
}));

const MobileDrawer = () => {
  const theme = useTheme(); // Get theme for potential use
  const { t } = useTranslation(); // Translation hook for internationalization
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer visibility
  const [textAnalysisOpen, setTextAnalysisOpen] = useState(false); // State to manage submenu visibility
  const [rotateIcon, setRotateIcon] = useState(false); // State to manage icon rotation

  // Open the drawer
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  // Close the drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Toggle Text Analysis submenu and icon rotation
  const handleTextAnalysisClick = () => {
    setTextAnalysisOpen(!textAnalysisOpen);
    setRotateIcon(!rotateIcon);
  };

  // Navigation items array
  const navigationItems = [
    {
      text: 'Data Prepare',
      icon: <img src={dataprepareimg} style={{ height: "23px" }} alt="Data Prepare" />,
      to: Routess.DataPrepare,
      onClick: handleDrawerClose,
    },
    {
      text: 'Text Analysis',
      icon: <img src={textanalysisimg} style={{ height: "23px" }} alt="Text Analysis" />,
      onClick: handleTextAnalysisClick,
      isOpen: textAnalysisOpen,
      children: [
        { text: t('summary'), icon:<img src={summary} style={{ height: "23px" }} alt="Summary" />, to: Routess.Summary },
        { text: t('QndA'), icon: <img src={qna} style={{ height: "23px" }} alt="QnA" />, to: Routess.QndA },
        { text: t('text-insight'), icon:<img src={textinsight} style={{ height: "23px" }} alt="Text Insight" />, to: Routess.TextInsight },
        { text: t('translate'), icon: <img src={translate} style={{ height: "23px" }} alt="Translate" />, to: Routess.Translate },
      ],
    },
    {
      text: 'Monitoring',
      icon: <img src={monitoringimg} style={{ height: "23px" }} alt="Monitoring" />,
      to: Routess.Monitoring,
      onClick: handleDrawerClose,
    },
  ];

  return (
    <div>
      {/* Button to open the drawer */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerOpen}
        sx={{ mr: 2 }}
      >
        <Menu />
      </IconButton>

      {/* Drawer component for navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <List sx={{ width: drawerWidth }}>
          {navigationItems.map((item, index) => (
            <React.Fragment key={item.text}>
              {/* Main navigation item */}
              <ListItemStyled
                button
                component={Link}
                to={item.to}
                onClick={() => {
                  if (item.children) {
                    handleTextAnalysisClick(); // Toggle submenu if item has children
                  } else {
                    handleDrawerClose(); // Close drawer if no children
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ margin: 0, marginLeft: '-20px' }} />
                {/* Expand/Collapse icon for Text Analysis */}
                {item.text === 'Text Analysis' && (
                  <IconButton
                    sx={{
                      marginLeft: 'auto',
                      padding: '0',
                      transition: 'transform 0.3s ease-in-out',
                      ...(rotateIcon && { transform: 'rotate(180deg)' }),
                    }}
                    onClick={handleTextAnalysisClick}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                )}
              </ListItemStyled>
              {index !== navigationItems.length - 1 && <Divider />} {/* Divider between items */}
              {/* Submenu items */}
              {item.isOpen && textAnalysisOpen && item.children && (
                <List sx={{ padding: 0 }}>
                  {item.children.map((childItem) => (
                    <React.Fragment key={childItem.text}>
                      <ListItemSubmenuStyled
                        button
                        component={Link}
                        to={childItem.to}
                        onClick={handleDrawerClose}
                      >
                        <ListItemIcon>{childItem.icon}</ListItemIcon>
                        <ListItemText
                          primary={childItem.text}
                          sx={{ margin: 0, marginLeft: '-20px' }}
                        />
                      </ListItemSubmenuStyled>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default MobileDrawer;
