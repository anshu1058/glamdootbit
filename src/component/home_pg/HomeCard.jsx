import React from 'react';
import {Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import "./homePage.css";


// CommonCard Component for home page
const HomeCard = ({ route, icon, title, content,color }) => (
  <Link to={route} className="link" >
    <Box className="box box1"  >
      <Box className="boxContent" >
        <Box>
        <img className='moduleicon' src={icon} alt="Logo" />
        </Box>
        <Box>
          <Typography className="link" style={{color:color}}>{title}</Typography>
          <Typography className="boxContent"  style={{color:color}}>{content}</Typography>
        </Box>
      </Box>
    </Box>
  </Link>
);

export default HomeCard;