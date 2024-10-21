import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { createStore, createStyleSet } from 'botframework-webchat';
import Chatbot from './Chatbot';
import PowerVirtualAgent from './PowerVirualAgent';
import './ChatApp.css';
import { Box, Tooltip, IconButton, Typography, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close, Minimize, Refresh } from '@material-ui/icons';
import Daasbot from './Daasbot';

const useStyles = makeStyles(theme => ({
    tooltip: {
        backgroundColor: "transparent",
        color: theme.palette.common.black
    },
    badge: {
        bottom: '65px',
        left: '54px',
        position: 'absolute',
        backgroundColor:'green',
    },
}));

const ChatBotIcon = ({ name, openChat, tooltip, selected, isMinimized }) => {
    const classes = useStyles();

    return (
        <Tooltip title={tooltip} placement="left">
            <div onClick={() => openChat(name)} style={{ position: 'relative' }}>
                <img className="botIcon" src={`/images/${name}${selected === name ? '' : ''}.png`} alt={name} />
                {isMinimized && (
                    <Badge color="secondary" overlap="circular" badgeContent=" " variant="dot" className={classes.badge} />
                )}
            </div>
        </Tooltip>
    );
};

const Newbot = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [showIcons, setShowIcons] = useState(false);
    const [selectedBot, setSelectedBot] = useState(null);
    const [forceRender, setForceRender] = useState(0);
    const [resetContent, setResetContent] = useState(false);
    const [minimizedBots, setMinimizedBots] = useState({});
    const [prevIconsState, setPrevIconsState] = useState(null);
    const [token, setToken] = useState();
    const [newMessage, setNewMessage] = useState(false);

    const store = useMemo(
        () =>
          createStore({}, ({ dispatch }) => next => action => {
            if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
              action = {
                ...action,
                payload: {
                  ...action.payload,
                  activity: {
                    ...action.payload.activity,
                    channelData: {
                      ...action.payload.activity.channelData,
                      email: 'rajagmail.com' // Injected email
                    }
                  }
                }
              };
            } else if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
              dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                  name: 'webchat/join',
                  value: {
                    language: window.navigator.language
                  }
                }
              });
            } else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
              if (action.payload.activity.from.role === 'bot') {
                setNewMessage(true);
              }
            }
    
            return next(action);
          }),
        []
      );

    useEffect(() => {
        setPrevIconsState({ ...minimizedBots });
    }, [selectedChat]); 

    const handleClose = () => {
         setMinimizedBots(prevState => ({
            ...prevState,
            // [name]: true
        }));
        setSelectedChat(false); 
    };

    const handleMinimize = (name) => {
        setMinimizedBots(prevState => ({
            ...prevState,
            [name]: true
        }));
        setSelectedChat(null);   
        setNewMessage(false);

    };

    const openChat = (name) => {
        setSelectedChat(name);
        setShowIcons(false);
        setSelectedBot(name);
        setMinimizedBots(prevState => ({
            ...prevState,
            [name]: false
        }));
    };

    const toggleIcons = () => {
    if (Object.values(minimizedBots).some(value => value)) {
        setMinimizedBots(prev => !prev);
       
    } else {
        setShowIcons(prev => !prev);
        
    }
};

    
    const getBotName = () => {
        switch (selectedBot) {
            case 'olbot':
                return 'ChatBot';
            case 'glambot':
                return 'Ask GLAM';
            case 'Daasbot':
                return 'DAAS Bot';
            default:
                return '';
        }
    };

    const refreshPVCBot = () => {
        setForceRender(prev => prev + 1);
    };

    const refreshGlamChatBot = () => {
        setForceRender(prev => prev + 1);
    };

    const resetBotContent = () => {
        setResetContent(true);
        setTimeout(() => {
            setResetContent(false);
        }, 100);
    };

    const handleRefresh = () => {
        if (selectedBot === 'glambot') {
            refreshGlamChatBot();
            resetBotContent();
        } else if (selectedBot === 'olbot' || selectedBot === 'Daasbot') {
            refreshPVCBot();
            resetBotContent();
        }
    };

    const handleFetchToken = useCallback(async () => {
      if (!token) {
        const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', { method: 'POST' });

        const { token } = await res.json();
        setToken(token);
      }
    }, [token]);

    return (
        <div style={{ position: 'absolute', bottom: 0, right: 20 }}>
            {showIcons && (
                <div className="botIconsContainer" >
                    <ChatBotIcon name="glambot" openChat={openChat} tooltip="Glam Bot" selected={selectedBot} isMinimized={minimizedBots['glambot']} />
                    <ChatBotIcon name="olbot" openChat={openChat} tooltip="OL Bank" selected={selectedBot} isMinimized={minimizedBots['olbot']} />
                    <ChatBotIcon name="Daasbot" openChat={openChat} tooltip="Daas Bot" selected={selectedBot} isMinimized={minimizedBots['Daasbot']} />
                </div>
            )}
            {selectedChat ? null : (
            <Tooltip title={Object.values(minimizedBots).some(value => value) ? "First close minimized bot" : "How can I help you"}>
                <img
                    src="/images/newglambotlogo.png"
                    alt="Chat Icon"
                    className="botIcon"
                    style={{border:"1px solid blue", position: 'fixed', bottom: '20px', right: '20px'}}
                    onClick={toggleIcons}
                />
            </Tooltip>
              )}

            {selectedChat ? (
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
                                src={`/images/${selectedBot}.png`}
                                alt="Chat Icon"
                                className="boticonglam"
                            />
                            <Typography className="bottext" variant="h5">
                                {getBotName()}
                            </Typography>
                        </Box>
                        <Box style={{ display: 'flex' }}>
                            {selectedBot && (
                                <>
                                    <IconButton onClick={() => handleMinimize(selectedBot)}>
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
                    {selectedChat === 'glambot' && <Chatbot resetContent={resetContent} />}
                    {selectedChat === 'olbot' && <PowerVirtualAgent
            className="react-web-chat"
            onFetchToken={handleFetchToken}
            store={store}
            token={token}
          />}
                    {selectedChat === 'Daasbot' && <Daasbot resetContent={resetContent} />}
                </Box>
            ) : (
                null
            )}

            {Object.values(minimizedBots).some(value => value) && (
                <div className="botIconsContainer">
                    <ChatBotIcon name="glambot" openChat={openChat} tooltip="Glam Bot" selected={selectedBot} isMinimized={minimizedBots['glambot']} />
                    <ChatBotIcon name="olbot" openChat={openChat} tooltip="OL Bank" selected={selectedBot} isMinimized={minimizedBots['olbot']} />
                    <ChatBotIcon name="Daasbot" openChat={openChat} tooltip="Daas Bot" selected={selectedBot} isMinimized={minimizedBots['Daasbot']} />
                </div>
            )}
        </div>
    );
};

export default Newbot;  
