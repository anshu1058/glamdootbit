// Summary parameter for mobile view tab providing different modals of gpt with the more features to see the variation in the generated summary.

import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ParameterTab from './ParameterTab'; // Import your ParameterTab component
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function MobileParameterTab(props) {
  const [state, setState] = useState({
    right: false,
  });

  const drawerWidth = 240;
  const drawerMargin = 10;

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor:'#d6e8ee',
            borderRadius:'10px 0px 0px 0px',
            margin:'50px 0 0 0',
            // padding: '0 0 0 25px',
            overflowY: 'unset', // Disable vertical scrollbar in the drawer
            // Add your custom scrollbar styles here
            '&::-webkit-scrollbar': {
              width: '8px',
              marginTop: '20px', // Adjust margin-top
              marginLeft: '10px', // Adjust margin-left
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
          },
        }}
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '8px', paddingLeft: '8px' ,margin:'4px 0 0 -22px' }}>
          <Button onClick={toggleDrawer('right', false)} style={{margin:'0 0 0 17px'}}>
            <ArrowForwardIcon/>
          </Button>
        </div>
        <ParameterTab
          mode={props.mode}
          model={props.model}
          temperature={props.temperature}
          topP={props.topP}
          modelsList={props.modelsList}
          selectedModel={props.selectedModel}
          onModelChange={props.onModelChange}
          maxLength={props.maxLength}
          frequencyPenalty={props.frequencyPenalty}
          presencePenalty={props.presencePenalty}
          onTemperatureChange={props.onTemperatureChange}
          onMaxLengthChange={props.onMaxLengthChange}
          onTopPChange={props.onTopPChange}
          onFrequencyPenaltyChange={props.onFrequencyPenaltyChange}
          onPresencePenaltyChange={props.onPresencePenaltyChange}
        />
      </Drawer>
      <Button onClick={toggleDrawer('right', true)}>
        <ArrowBackIcon />
      </Button>
    </div>
  );
}
