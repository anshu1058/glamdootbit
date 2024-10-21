import React, { useState, useRef } from 'react';
import ChatBotSelector from './ChatBotSelector';
import Chatbot from './Chatbot';
import PowerVirtualAgent from './PowerVirualAgent';
import './ChatApp.css';
import { Box, Tooltip, IconButton, Typography } from '@material-ui/core';
import { Close, Minimize, Refresh } from '@material-ui/icons';
import BotChat from './BotChat';

const MainBot = () => {
  const [selectedBot, setSelectedBot] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [minimizedBotName, setMinimizedBotName] = useState('');
  const webChatRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [resetContent, setResetContent] = useState(false); // State to reset content

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedBot(null);
    setMinimizedBotName('');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setMinimizedBotName(getBotName());
  };

  const getBotName = () => {
    switch (selectedBot) {
      case 'PVCBot':
        return 'ChatBot';
      case 'GlamChatBot':
        return 'Ask GLAM';
      default:
        return 'Ask Bot'; // Default name when no bot is selected
    }
  };

  const refreshPVCBot = () => {

    setForceRender((prev) => prev + 1); // Increment forceRender to trigger re-render
  };

  const refreshGlamChatBot = () => {

    setForceRender((prev) => prev + 1); // Increment forceRender to trigger re-render
  };

  const resetBotContent = () => {
    // Implement logic to reset bot content based on the selected bot
    // For example:
    // Assuming 'PowerVirtualAgent' and 'Chatbot' components have a prop named 'resetContent' to trigger content reset
    setResetContent(true); // Trigger content reset
    setTimeout(() => {
      setResetContent(false); // Reset the resetContent state after a short delay
    }, 100);
  };

  const handleRefresh = () => {
    if (selectedBot === 'PVCBot') {
      refreshPVCBot(); // Refresh PowerVirtualAgent bot
      resetBotContent(); // Reset PowerVirtualAgent content
    } else if (selectedBot === 'GlamChatBot') {
      refreshGlamChatBot(); // Refresh Chatbot
      resetBotContent(); // Reset Chatbot content
    }
  };

  return (
    <div className="bot-icon-wrapper">
      {!isMinimized && (
        <>
          {!isOpen ? (
            <Tooltip title="how can i help  you">
              <img
                src="/images/image.jpg"
                alt="Chat Icon"
                className="boticon"
                onClick={toggleChat}
              />
            </Tooltip>
          ) : (
            <Box className="mainbotstyle">
              <Box className="botheader">
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '5px',
                  }}
                >
                  <img
                    src="https://avatarbot.blob.core.windows.net/container/Solutions%20(2).png"
                    alt="Chat Icon"
                    className="boticonglam"
                  />
                  <Typography className="bottext" variant="h6">
                    {getBotName()}
                  </Typography>
                </Box>
                <Box style={{ display: 'flex' }}>
                  {selectedBot && (
                    <>
                      <IconButton onClick={handleMinimize}>
                        <Minimize style={{ color: 'white', marginTop: '-12px' }} />
                      </IconButton>
                      <IconButton onClick={handleRefresh}>
                        <Refresh style={{ color: 'white' }} />
                      </IconButton>
                    </>
                  )}
                  <IconButton onClick={handleClose}>
                    <Close style={{ color: 'white' }} />
                  </IconButton>
                </Box>
              </Box>

              {selectedBot ? (
                <div>
                  {selectedBot === 'PVCBot' ? (
                    <PowerVirtualAgent resetContent={resetContent} />
                  ) : selectedBot === 'GlamChatBot' ? (
                    <Chatbot resetContent={resetContent} />
                  ) : null}
                </div>
              ) : (
                <ChatBotSelector onSelectBot={setSelectedBot} />
              )}
            </Box>
          )}
        </>
      )}
      {isMinimized && (
        <Tooltip title={`Open ${minimizedBotName}`} arrow>
          <img
            src="/images/image.jpg"
            alt="Chat Icon"
            className="boticon"
            onClick={() => setIsMinimized(false)}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default MainBot;
