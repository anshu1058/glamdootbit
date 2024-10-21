import React, { useState, useRef, useEffect,useContext } from 'react';
import { Box, TextField, InputAdornment, Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Send,ExpandMore} from '@mui/icons-material';
import './ChatApp.css';
import axios from 'axios';
import './webchat.css';
import AdaptiveCardsComponent from './AdaptiveCards';
import glambot from '../../../../assets/glambot.png';
import avtarr from '../../../../assets/avtarr.png';
import { ThemeContext } from "../../../header/ThemeContext";
import { marked } from 'marked';


const Chatbot = ({ resetContent }) => {
  const [conversationId, setConversationId] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [tags, setTags] = useState(['bing', 'sqlsearch', 'chatgpt', 'analyze', 'docsearch']);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const [animationStopped, setAnimationStopped] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [watermark, setWatermark] = useState('');
  const [newwatermark, setNewwatermark] = useState('');
  const [receivedMessageIds, setReceivedMessageIds] = useState([]);
  const [chatbotHeight, setChatbotHeight] = useState(437);
  const [msg, setmsg] = useState([])
  const [showHelpTag, setShowHelpTag] = useState(true);
  const { theme } = useContext(ThemeContext); 
  const backgroundColor = theme === "dark" ? "#333" : "rgb(242 245 245)"; 
  const color = theme === "dark" ? "white" : ""; 
  const [inputDisabled, setInputDisabled] = useState(false);

  
  // const [resetContent, setResetContent] = useState(false);

  // const directLineToken ="rf3nOgYn8M4.V6HJqwZdPnJp412wfQY6KQTXpp9jnB0beBk7m5gug04";
  const directLineToken=process.env.REACT_APP_CHAT_BOT_DIRECT_LINE_TOKEN;
  const maxRetries = 3;

  const increaseFrameSize = () => {
    // Increase the bot frame height by 100px
    setChatbotHeight((prevHeight) => prevHeight + 100);
  };

  const decreaseFrameSize = () => {
    // Decrease the bot frame height by 100px, ensuring it doesn't go below a minimum height
    if (chatbotHeight > 100) {
      setChatbotHeight((prevHeight) => prevHeight - 100);
    }
  };

  const stopAnimation = () => {
    setAnimationStopped(true);
  };

  const toggleMinimize = () => {
    setIsMinimized((prevState) => !prevState);
    setIsMaximized(false); // Ensure maximized state is false when minimizing
  };
  const toggleMaximize = () => {
    setIsMaximized((prevState) => !prevState);
    setIsMinimized(false); // Ensure minimized state is false when maximizing
  };
  const avatarIcons = {
    user: '/images/chitti.png',
    bot: '/images/chitti.png',
  };

  const showGreeting = () => {
    setShowGreetingBubble(true);
  };

  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0) {
      chatContainerRef.current.scroll({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const extractLinks = (text) => {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      links.push(match[2]);
    }
    return links;
  };
  const extractques = (text) => {
    const sentences = text?.split(/[.!]/);
    const lastQuestion = sentences?.reverse().find((sentence) => sentence.trim().endsWith("?"));
    const linkRegex = /\b(?:what|who|where|when|why|how|is|would|can)\b.*\?/i;
    const que = [];

    if (lastQuestion) {
      const match = lastQuestion.match(linkRegex);
      if (match) {
        que.push(match[0]);
      }
    }

    return que;
  };


  useEffect(() => {
    axios
      .post('https://directline.botframework.com/v3/directline/conversations', {}, {
        headers: {
          Authorization: `Bearer ${directLineToken}`,
        },
      })
      .then((response) => {
        setConversationId(response.data.conversationId);
      })
      .catch((error) => {
        console.error('Direct Line conversation initialization error:', error);
      });
  }, []);

  const fetchBotResponseBasedOnTextAndTimestamp = async (conversationId) => {
    try {
      const response = await axios.get(
        `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
        {
          headers: {
            Authorization: `Bearer ${directLineToken}`,
          },
        }
      );
      if (response.status === 200) {
        const activities = response.data.activities;
        const lastActivity = activities[activities.length - 1];
        // const match = lastActivity.text.match(/\b(?:what|who|where|when|why|how)\b.*\?/i);
        const lastQuestion = extractques(lastActivity.text)


        // Step 2: Find the last sentence that ends with a question mark

        const links = extractLinks(lastActivity.text);


        if (activities.length > 0) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: lastActivity.text
                .replace(/<a\b[^>]*>.*?<\/a>/g, '')
                .replace(lastQuestion, '').trim()
                .replace(/<\/?[^>]+(>|$)/g, ''), // Remove links from the text
              user: 'bot',
              link: links,
              ques: lastQuestion,
              // timestamp: lastActivity.timestamp,
              isLink: false,
            },
          ]);
        }
      }
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching bot response based on text and timestamp:', error);
    }
  };

  const sendMessage = async () => {
    if (message && conversationId) {
      setInputDisabled(true);
      setIsTyping(true);
      setstopFetching(false)
      axios
        .post(
          `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
          {
            locale: 'en-EN',
            localTimestamp: new Date().toISOString(),
            type: 'message',
            from: { id: 'user' },
            text: message,
          },
          {
            headers: {
              Authorization: `Bearer ${directLineToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          const id = response.data.id;
          const watermark = id.split('|')[1];
          setWatermark(watermark)
          fetchBotResponses();
        })
        .catch((error) => {
          console.error('Error sending message to the bot:', error);
          // setTimeout(async () => {
          // fetchBotResponseBasedOnTextAndTimestamp(conversationId);
          // }, 20000);
          fetchBotResponses();
        });

      const userMessageTimestamp = new Date().toLocaleString();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          user: 'user',
          timestamp: userMessageTimestamp,
        },
      ]);
      setMessage('');
    }
  };

  const [stopFetching, setstopFetching ]=useState(false); // A flag to stop further API calls
  const fetchBotResponses = () => {
    if (conversationId && !stopFetching) {
      axios
        .get(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
          headers: {
            'Authorization': `Bearer ${directLineToken}`,
          },
        })
        .then((response) => {
          const activities = response.data.activities;
          let shouldStop = false;
          let newMessages = [];  
          activities.forEach((activity) => {
            if (activity.from.id === 'GlamBot' && !receivedMessageIds.includes(activity.id)) {
              if (activity.type === 'message') { 
                // Skip welcome message
                if (activity.text.includes('Hello and welcome! 👋 My name is GlamBot, a smart virtual assistant designed to assist you.')) {
                  return;
                }
  
                // Skip "Tool:" messages
                if (activity.text.toLowerCase().includes('tool:')) {
                  return; // Skip the message entirely
                }
  
                if (activity.text === 'EOC') {
                  // Stop fetching further messages and end the conversation
                  shouldStop = true;
                  setIsTyping(false);
                  // Normal message processing
                  setReceivedMessageIds((prevIds) => [...prevIds, activity.id]);
                  return; // Do not add "EOC" to the messages
                }
  
  
                const links = extractLinks(activity.text);
                const lastQuestion = extractques(activity.text);
                const processedMessage = {
                  id: 'bot-' + Date.now(),
                  text: activity.text
                    .replace(/<a\b[^>]*>.*?<\/a>/g, '') // Remove anchor tags
                    .replace(lastQuestion, '') // Remove last question
                    .trim(),
                  user: 'bot',
                  link: links,
                  ques: lastQuestion,
                  timestamp: new Date(activity.timestamp).toLocaleString(),
                  watermark: activity.replyToId ? activity.replyToId.split('|')[1] : null,
                };
                newMessages.push(processedMessage);
              }
            }
          });
  
          // Append new messages to the existing chat history
          if (newMessages.length > 0) {
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
          }
  
          if (shouldStop) {
            setstopFetching(true); // Stop further API calls
            setInputDisabled(false); // Enable input box when conversation ends
          }
        })
        .catch((error) => {
          console.error('Error fetching bot responses:', error);
        });
    }
  };
  
  
  const analyzefetchBotResponses = () => {
    if (conversationId && !stopFetching) { // Check stopFetching flag to stop further requests
      axios
        .get(`https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`, {
          headers: {
            'Authorization': `Bearer ${directLineToken}`,
          },
        })
       
        .then((response) => {
          const activities = response.data.activities.filter(activity => !receivedMessageIds.includes(activity.id));
          let shouldStop = false; // Local flag to stop message fetching
          const newMessages = [];
        
          activities.forEach(activity => {
            const attachments = activity.attachments || [];
            setReceivedMessageIds(prevIds => [...prevIds, activity.id]);
  
            if (activity.type === 'message') {
              if (activity.text === 'EOC') {
                // Stop fetching further messages and do not add "EOC" to the messages
                shouldStop = true;
                setIsTyping(false);
                return; // Exit this iteration and skip adding "EOC" to messages
              }
  
              attachments.forEach(attachment => {
                const newMessage = {
                  id: 'bot-' + Date.now(),
                  user: 'bot',
                  timestamp: new Date(activity.timestamp).toLocaleString(),
                  watermark: activity.replyToId ? activity.replyToId.split('|')[1] : null,
                  attachments: [attachment], // Store the attachment data here
                };
                newMessages.push(newMessage);
              });
            }
          });
  
          // Add new messages to the state
          if (newMessages.length > 0) {
            setMessages(prevMessages => [...prevMessages, ...newMessages]);
          }
  
          // Stop further API calls if "EOC" was received
          if (shouldStop) {
            setstopFetching(true); // Stop further API calls
            setInputDisabled(false); // Enable input box when conversation ends
          }
        })
        .catch((error) => {
          console.error('Error fetching bot responses:', error);
        });
    }
  };
  
  useEffect(() => {
    if( conversationId && !stopFetching){
    const pollBotResponses = () => {
      // if (msg.length !== 0) {
      fetchBotResponses();
      analyzefetchBotResponses();
      // }

    };

    // Polling every 5 seconds
    const pollIntervalId = setInterval(pollBotResponses, 5000);
    // Clear the interval when the component is unmounted
    return () => clearInterval(pollIntervalId);
  }
  }, [watermark, conversationId, receivedMessageIds,stopFetching]);



  // const fetchBotResponses = () => {
  //   if (conversationId) {
  //     axios
  //       .get(
  //         `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities?watermark=${watermark}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${directLineToken}`,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         const newMessages = response.data.activities.filter((activity) => activity.from.id === 'GlamBot');
  //           console.log("hii",response.data.watermark)
  //           setNewwatermark(response.data.watermark)
  //         if (newMessages.length > 0) {
  //           const lastMessage = newMessages[newMessages.length - 1];
  //           const botMessageTimestamp = new Date(lastMessage.timestamp).toLocaleString();

  //           const lastQuestion = extractques(lastMessage.text)
  //           const links = extractLinks(lastMessage.text);

  //           setMessages((prevMessages) => [
  //             ...prevMessages,
  //             {
  //               text: lastMessage.text
  //                 .replace(/<a\b[^>]*>.*?<\/a>/g, '')
  //                 .replace(lastQuestion, '').trim()
  //                 .replace(/<\/?[^>]+(>|$)/g, ''), // Remove links from the text
  //               user: 'bot',
  //               link: links,
  //               ques: lastQuestion,
  //               timestamp: botMessageTimestamp,
  //               isLink: false,
  //             },
  //           ]);

  //           setIsTyping(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching bot responses:', error);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   // Polling mechanism to continuously check for new messages
  //   const pollInterval = 2000; // Set the polling interval in milliseconds (adjust as needed)

  //   const pollBotResponses = async () => {
  //     await fetchBotResponses();

  //     // Poll again after the specified interval
  //     setTimeout(pollBotResponses, pollInterval);
  //   };

  //   // Start polling when conversationId and watermark are available
  //   if (conversationId && watermark) {
  //     pollBotResponses();
  //   }
  // }, [conversationId, watermark]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
    setMessages([]);
    setIsMinimized(false);
  };
  const minimizeChat = () => {
    setIsOpen((prevState) => !prevState);
    // setMessages([]);
    setIsMinimized(false);
  };

  const resetChatContent = () => {
    setMessages([]);
    setTags(['bing', 'sqlsearch', 'chatgpt', 'analyze', 'docsearch']);
  };

  useEffect(() => {
    if (resetContent) {
      resetChatContent(); // Reset content when resetContent changes
      // setResetContent(false); // Reset back to false after content reset
    }
  }, [resetContent]);

  const addTagToInput = (tag) => {
    setMessage(`@${tag},`);
    // Highlight the selected tag
    const tagsElements = document.querySelectorAll('.botquestag');
    tagsElements.forEach((element) => {
      if (element.textContent === tag) {
        element.classList.add('selected-tag');
      } else {
        element.classList.remove('selected-tag');
      }
    });
  };
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);
  useEffect(() => {
    // Save messages to local storage whenever it changes
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  return (
    <div>
      {/* {!isOpen && (
        <>
          <Tooltip title="How can I help you">
            <img
              src="/images/image.jpg"
              alt="Chat Icon"
              className="boticon"
              onClick={() => {
                toggleChat();
                showGreeting();
              }}
            />
          </Tooltip>
          {showHelpTag && (
            <div className="help-tag">
              <span className="help-text">How can I help you?</span>
              <IconButton onClick={() => setShowHelpTag(false)}>
                <Close />
              </IconButton>
            </div>
          )}
        </>
      )} */}
      {/* {isOpen && ( */}
      {/* <Box className={`botstyle ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`}
          style={{ width: `${chatbotHeight}px` }}> */}
      <Box className='newOLbot' style={{height:"78.5vh", width:"32.5 rem"}}>
        {/* <Box className={`botstyle ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`} style={{ height: `${chatbotHeight}px` }}> */}
        {/* <Box className="botheader">
            <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "5px" }}>
              <img
                src="/images/image.jpg"
                alt="Chat Icon"
                className="boticonglam"
              />
              <Typography className="bottext" variant="h6">
                Ask GLAM
              </Typography>
            </Box>
            <Box style={{ display: "flex" }}>
              {!isMinimized && (
                <IconButton onClick={minimizeChat}>
                  <MinimizeIcon style={{ color: 'white', marginTop: "-12px" }} />
                </IconButton>
              )}
              {isMinimized && (
                <IconButton onClick={toggleMaximize}>
                  <MinimizeIcon style={{ color: 'white', marginTop: "-12px" }} />
                </IconButton>
              )} */}
        {/* {chatbotHeight > 437 ? (
                <IconButton onClick={decreaseFrameSize}>
                  <AiOutlineFullscreenExit style={{ color: 'white' }} />
                </IconButton>
              ) : (
                <IconButton onClick={increaseFrameSize}>
                  <FaExpandAlt style={{ color: 'white' }} />
                </IconButton>
              )} */}
        {/* <IconButton onClick={handleRefresh}>
                <Refresh style={{ color: 'white' }} />
              </IconButton>
              <IconButton onClick={toggleChat}>
                <Close style={{ color: 'white' }} />
              </IconButton>

            </Box>
          </Box> */}
        {/* {!isMinimized && ( */}
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '78.5vh',background:backgroundColor , borderRadius: "25px"}}>
        <Box ref={chatContainerRef} className="greetingBox" style={{background:backgroundColor,color:color,overflowY:'auto'}}>
          {/* {messages.length === 0 ? ( */}
          <Box style={{ display: 'flex' }}>
            {/* <img
              src={glambot}
              alt="Chat Icon"
              className="boticonglam"
            /> */}
            <Box className="botreply" onAnimationIteration={stopAnimation}>
              Hello and welcome! 👋<br></br>
              <br></br>
              I am DOOT, your intelligent virtual assistant here to help you.
              {/* <p style={{ fontSize: '12px' }}>How can I help you?</p> */}
            </Box>
          </Box>
          {/* ) : ""
          } */}
          {messages.map((msg, index) => (
            <>
              <Box key={index} style={{ marginBottom: '10px' }}>
                {msg.user === 'user' && (
                  <>
                    <Box className="msgbox">
                      <Box className="userinput">{msg.text}</Box>
                      {/* <img src={avtarr} height="35px" /> */}
                    </Box>
                  </>
                )}

                {msg.user === 'bot' && (
                  <>
                    {msg.watermark !== undefined ? (
                      <>
                        {msg.text && msg.text !== '' ? (
                          <Box className="boticonstyling">
                            {/* <img
                              src={glambot}
                              alt="Chat Icon"
                              className="boticonglam"
                            /> */}
                            <Box className="botreply">
                              {/* {msg.text} */}
                              {msg.text &&
                                // msg.text?.split('\n').map((line, index) => (
                                  <Typography key={index} variant='body2'>
                                     <div dangerouslySetInnerHTML={{ __html: marked(msg.text) }}  />
                                  </Typography>
                                // ))
                                }
                               {msg.link && (<>
                              {msg.link?.length > 0 ? (
                                <>
                                  <Divider />
                                  {/* <Typography component="p">Reference {msg.link.length}</Typography> */}
                                  <Accordion style={{  }}>
                                    <AccordionSummary
                                      expandIcon={<ExpandMore />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{maxHeight: "5px"}}
                                    >
                                      <Typography>
                                        References:{msg.link.length}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails style={{ display: "flex", flexDirection: "column", background:"#d6e8ee"}}>
                                      {msg.link.map((link, linkIndex) => (
                                        <Box
                                          key={linkIndex}
                                          className="boticonstyling"
                                          
                                        >
                                          <Box className="botreply" style={{ textWrap:"wrap" }}>
                                            <span style={{overflowWrap:"anywhere", textWrap:"wrap",height:"5vh"}}>
                                            <a href={link} target="_blank" rel="noopener noreferrer" >
                                              {`${linkIndex + 1}: ${link}`}
                                            </a>
                                            </span>
                                          </Box>
                                        </Box>
                                      ))}
                                    </AccordionDetails>
                                  </Accordion>
                                </>
                              ) : ''}
                              </>)}
                            </Box>
                          </Box>
                        ) : ('')}

                        {msg.ques &&
                          msg.ques.map((que, linkIndex) => (
                            <Box key={linkIndex} className="boticonstyling">
                              {/* <img
                                src={glambot}
                                alt="Chat Icon"
                                className="boticonglam"
                              /> */}
                              <Box className="botreply">
                                <Typography variant='body2'>
                                  {que}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        {msg.attachments &&
                          (
                            <>
                        {msg.attachments.length > 0? (
                            <Box className="boticonstyling">
                              {/* <img
                                src={glambot}
                                alt="Chat Icon"
                                className="boticonglam"
                              /> */}
                              <Box className="botreply">
                                <AdaptiveCardsComponent att={msg.attachments[0].content.body} />
                              </Box>
                            </Box>
                         ):("")}
                            </>
                          )
                        }
                      </>) : ('')
                    }
                  </>
                )}
              </Box>
            </>

          ))}
          {isTyping && (
            <div >
              <div className="message-content">
                <div className="typing-animation">
                  <div className="dot-1"></div>
                  <div className="dot-2"></div>
                  <div className="dot-3"></div>
                </div>
              </div>
            </div>
          )}
        </Box>
        {/* )} */}
        {/* {!isMinimized && ( */}
        <Box className="textarea-chatBot" >
          <Box style={{ width: '100%',display:"flex",justifyContent:"center" }}>
            {/* <Box className="questagmain">
              {tags.map((tag) => (
                <Box
                  key={tag}
                  className="botquestag"
                  onClick={() => addTagToInput(tag)}
                >
                  <span>
                    {tag}
                  </span>
                </Box>
              ))}
            </Box> */}
          </Box>
          <Box className="textarea2">
            {/* <HomeIcon className="homeicon" onClick={handleRefresh} /> */}
            <TextField
              className="textfield"
              variant="outlined"
              size="small"
              fullWidth
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={handleInputKeyDown}
               disabled={inputDisabled}
              style={{background:"white",color:color}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                    <Send style={{ color: '#bcbbbb' }} onClick={sendMessage} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        {/* )} */}
        {documentUrl && (
          <Typography className="docs">
            Document uploaded successfully.{' '}
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </Typography>
        )}
      </Box>
      </Box>
      {/* )} */}
    </div>
  );
};

export default Chatbot;
