import React, { useCallback, useEffect, useState } from 'react';
import { createDirectLine, createStore } from 'botframework-webchat';
import { Box, IconButton, Tooltip, Typography, Badge } from '@mui/material';
import { Close, Minimize, Refresh } from '@mui/icons-material';
import classNames from 'classnames';
import './MinimizableWebChat.css';
import Daasbot from './Daasbot';
import Chatbot from './Chatbot';
import glambot from '../../../../assets/glambot.png';
import olbot from '../../../../assets/olbot.png';
import daasbot from '../../../../assets/Daasbot.png';
import botlogo from '../../../../assets/newglambotlogo.png';
import PowerVirtualAgent from './OLbot';

// Fetch token from the server
const fetchToken = async () => {
  const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', { method: 'POST' });
  const { token } = await res.json();
  return token;
};

// Component for displaying chat bot icons
const ChatBotIcon = ({ name, openChat, tooltip, showBadge }) => {
  // Get the image source for the chat bot based on its name
  const getBotImage = () => {
    switch (name) {
      case 'glambot':
        return glambot;
      case 'olbot':
        return olbot;
      case 'Daasbot':
        return daasbot;
      default:
        return '/images/default.png';
    }
  };

  return (
    <Tooltip title={tooltip} placement="left">
      <div onClick={() => openChat(name)} style={{ position: 'relative' }}>
        <img className="botIcon" src={getBotImage()} alt={name} />
        {showBadge && (
          <Badge
            color="secondary"
            overlap="circular"
            badgeContent=" "
            variant="dot"
            style={{ position: 'absolute' }}
            className='badge'
          />
        )}
      </div>
    </Tooltip>
  );
};

const MinimizableWebChat = () => {
  // State variables
  const [session, setSession] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [showIcons, setShowIcons] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [resetContent, setResetContent] = useState(false);

  // Initialize conversation for the selected bot
  const initConversation = useCallback((botName) => {
    setSession((prevSessions) => {
      if (prevSessions[botName]) return prevSessions;

      return {
        ...prevSessions,
        [botName]: false,
      };
    });

    (async function () {
      const token = await fetchToken();
      const key = Date.now();

      setSession((prevSessions) => ({
        ...prevSessions,
        [botName]: {
          directLine: createDirectLine({ token }),
          key,
          store: createStore({}, () => (next) => (action) => next(action)),
        },
      }));
    })();
  }, []);

  // Handle side effects based on the loaded state and selected bot
  useEffect(() => {
    if (loaded && selectedBot) {
      initConversation(selectedBot);
    }
  }, [loaded, initConversation, selectedBot]);

  // Handle the refresh button click
  const handleRefresh = useCallback(() => {
    if (selectedBot === 'glambot') {
      resetBotContent();
    } else {
      (async () => {
        const token = await fetchToken();
        const key = Date.now();

        setSession((prevSessions) => ({
          ...prevSessions,
          [selectedBot]: {
            directLine: createDirectLine({ token }),
            key,
            store: createStore({}, () => (next) => (action) => next(action)),
          },
        }));
      })();
    }
  }, [selectedBot]);

  // Function to reset bot content
  const resetBotContent = () => {
    setResetContent(true);
    setTimeout(() => {
      setResetContent(false);
    }, 100); // Short delay to allow the reset to take effect
  };

  // Handle the close button click
  const handleCloseButtonClick = useCallback(() => {
    setLoaded(false);
    setMinimized(true);
    setSelectedBot(null);
    setShowIcons(false);
  }, []);

  // Handle the maximize button click
  const handleMaximizeButtonClick = useCallback(() => {
    setLoaded(true);
    setMinimized(false);
    setShowIcons(false);
  }, []);

  // Handle the minimize button click
  const handleMinimizeButtonClick = useCallback(() => {
    setMinimized(true);
    setShowIcons(true);
  }, []);

  // Toggle the visibility of bot icons
  const toggleIcons = useCallback(() => {
    setShowIcons((prev) => !prev);
  }, []);

  // Handle the bot icon click to select and open a chat
  const handleBotIconClick = useCallback((botName) => {
    setSelectedBot(botName);
    setMinimized(false);
    setLoaded(true);
    setShowIcons(false);
  }, []);

  // Get the bot name based on the selected bot
  const getBotName = () => {
    switch (selectedBot) {
      case 'olbot':
        return 'ChatBot';
      case 'glambot':
        return 'Ask Doot';
      default:
        return '';
    }
  };

  // Get the bot image based on the selected bot
  const getBotImage = () => {
    switch (selectedBot) {
      case 'olbot':
        return olbot;
      case 'glambot':
        return glambot;
        case 'Daasbot':
          return daasbot;
      default:
        return '/images/default.png';
    }
  };

  return (
    // <div className="minimizable-web-chat" style={{ position: 'absolute', bottom: 0, right: 15 }}>
    //   {showIcons && minimized && (
    //     <div className="botIconsContainer">
    //       <ChatBotIcon
    //         name="glambot"
    //         openChat={handleBotIconClick}
    //         tooltip="Doot"
    //         showBadge={minimized && selectedBot === 'glambot'}
    //       />
    //       <ChatBotIcon
    //         name="olbot"
    //         openChat={handleBotIconClick}
    //         tooltip="Olbot"
    //         showBadge={minimized && selectedBot === 'olbot'}
    //       />
    //     </div>
    //   )}
    //   {(!selectedBot || minimized) && (
    //     <Tooltip title={minimized ? "How can I help you" : "First close minimized bot"}>
    //       <img
    //         src={botlogo}
    //         alt="Chat Icon"
    //         className="botIcon"
    //         style={{ border: "1px solid blue", position: 'fixed', bottom: '10px', right: '15px' }}
    //         onClick={toggleIcons}
    //       />
    //     </Tooltip>
    //   )}
    //   {loaded && (
    //     <Box className={classNames('chat-box', minimized ? 'hide' : '')}>
    //       <Box className={`mainbotstyle ${minimized ? 'minimized' : ''}`}>
    //         <Box className="botheader">
    //           <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '12px' }}>
    //             <img
    //               src={getBotImage()}
    //               alt={selectedBot}
    //               className="boticonglam"
    //             />
    //             <Typography className="bottext" variant="h6">
    //               {getBotName()}
    //             </Typography>
    //           </Box>
    //           <Box style={{ display: 'flex' }}>
    //             <IconButton onClick={handleMinimizeButtonClick}>
    //               <Minimize style={{ color: 'white', marginTop: '-12px' }} />
    //             </IconButton>
    //             <IconButton onClick={handleRefresh}>
    //               <Refresh style={{ color: 'white' }} />
    //             </IconButton>
    //             <IconButton onClick={handleCloseButtonClick}>
    //               <Close style={{ color: 'white' }} />
    //             </IconButton>
    //           </Box>
    //         </Box>
    //         {selectedBot === 'glambot' && <Chatbot resetContent={resetContent} />}
    //         {selectedBot === 'olbot' && (
    //           <PowerVirtualAgent
    //             className="react-web-chat"
    //             directLine={session?.[selectedBot]?.directLine}
    //             store={session?.[selectedBot]?.store}
    //             key={session?.[selectedBot]?.key} // Ensure re-rendering on refresh
    //           />
    //         )}
    //         {selectedBot === 'Daasbot' && (
    //           <Daasbot
    //             className="react-web-chat"
    //             directLine={session?.[selectedBot]?.directLine}
    //             store={session?.[selectedBot]?.store}
    //             key={session?.[selectedBot]?.key} // Ensure re-rendering on refresh
    //           />
    //         )}
    //       </Box>
    //     </Box>
    //   )}
    // </div>
<div className="minimizable-web-chat" style={{ position: 'absolute', bottom: 0, right: 15 }}>
  {minimized && (
    <Tooltip title="How can I help you">
      <img
        src={glambot}
        alt="Chat Icon"
        className="botIcon"
        style={{ border: "1px solid blue", position: 'fixed', bottom: '10px', right: '15px' }}
        onClick={() => {
          handleBotIconClick(); // Open chat on click
          setSelectedBot('olbot'); // Ensure olbot is selected
        }}
      />
    </Tooltip>
  )}

  {loaded && !minimized && selectedBot === 'olbot' && ( // Ensure selectedBot is olbot
    <Box className="chat-box">
      <Box className="mainbotstyle">
        <Box className="botheader">
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '12px' }}>
          <img
              src={glambot} // Use Daasbot's image in the chat header
              alt="Daasbot"
              className="boticonglam"
            />
            <Typography className="bottext" variant="h6" style={{marginLeft:"5px"}}>
              Doot
            </Typography>
          </Box>
          <Box style={{ display: 'flex' }}>
            <IconButton onClick={handleMinimizeButtonClick}>
              <Minimize style={{ color: 'white', marginTop: '-12px' }} />
            </IconButton>
            <IconButton onClick={handleRefresh}>
              <Refresh style={{ color: 'white' }} />
            </IconButton>
            <IconButton onClick={handleCloseButtonClick}>
              <Close style={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>
        <PowerVirtualAgent
          className="react-web-chat"
          directLine={session?.olbot?.directLine}
          store={session?.olbot?.store}
          key={session?.olbot?.key} // Ensure re-rendering on refresh
        />
      </Box>
    </Box>
  )}
</div>


  );
};

export default MinimizableWebChat;
