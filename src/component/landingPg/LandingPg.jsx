import React from 'react';
import Header from '../header/Header';
import SideMenu from '../SideMenu';
import { Hidden } from '@mui/material';

const LandingPg=()=> {
  return (
    <>
      {/* <Row>
        <Col> */}
          <Header/>
          <Hidden mdDown>
          <SideMenu/>
          </Hidden>
          {/* <HomePage/> */}
        {/* </Col>
      </Row> */}
         {/* <Hidden smDown>
      <Row>
        <Col>
          <SideMenu/>
        </Col>
      </Row>
          </Hidden> */}
          {/* <Newbot/> */}
    </>
  );
}

export default LandingPg;
