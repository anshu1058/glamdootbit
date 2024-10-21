import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';

const ChatBotSelector = ({ onSelectBot }) => {
  const handleBotSelection = (bot) => {
    onSelectBot(bot);
  };

  return (
    <div className="App">
      <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", margin: "12px" }}>
        <Typography>Select bot</Typography>
        <div>
          <Button variant='outlined' color="primary" onClick={() => handleBotSelection('PVCBot')} style={{ marginRight: "8px" }}>OL Bot</Button>
          <Button variant='outlined' color="primary" onClick={() => handleBotSelection('GlamChatBot')}>Glam Chat Bot</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotSelector;
