// QnA component
import React, { useState, useRef, useEffect,useContext } from "react";
import axios from "axios";
import loadingIcon from "./loadinganimation.gif";
import "./qna.css";
import {
  InputAdornment,
  TextField,
  Grid,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { Send,Close, Block } from "@mui/icons-material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Citations from "./CItation";
import { ReactTyped } from "react-typed";
import StopIcon from "@mui/icons-material/Stop";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, clearMessages } from "../../Redux/Store/Store";
import CopyIcon from "@mui/icons-material/FileCopy";
import ShareIcon from "@mui/icons-material/Share";
import RegenerateIcon from "@mui/icons-material/Autorenew";
import Snackbar from "@mui/material/Snackbar";
import LikeButton from "./LikeButton";
import { useTracking } from "react-tracking";
import { useTranslation } from "react-i18next";
import { addTrackingData } from '../../Redux/Store/Store';
import { fetchBotResponse, initializeSearch,cancelBotResponseRequest } from "./Q&Ahelper";
import { useFetchContainersAndBlobs } from "../../data_prepare/azure-blob-stoage";
import { ThemeContext } from "../../header/ThemeContext";
import ReactMarkdown from 'react-markdown';
import {marked} from 'marked';



const DeployedQndA = () => {
  const {t}=useTranslation();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [gridSize, setGridSize] = useState({ lg: 11.5}); // Initial grid size is lg={12}
  const [showIntroText, setShowIntroText] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery( "(min-width:601px) and (max-width:960px)");
  const [citationContent, setCitationContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isPrintingResponse, setIsPrintingResponse] = useState(false);
  const [indexName,setIndexName]=useState('')
  const [isTyping, setIsTyping] = useState(false);
  const [stop, setStop] = useState(false);
  const { containersWithBlobs } = useFetchContainersAndBlobs();
  const { theme } = useContext(ThemeContext); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const backgroundColor = theme === "dark" ? "#333" : "#fff"; 
  const color = theme === "dark" ? "white" : ""; 
 
  const { trackEvent } = useTracking();
  const dispatch = useDispatch();
 
 // Filter containers with blobs
const accessibleContainers = containersWithBlobs
.filter(container => container.blobs.length > 0)
.map(container => container.container);

// Function to get index name based on container name
const getIndexName = (containerName) => {
  if (containerName === "finance") {
    return "galmfinanceindexvector1";
  } else if (containerName === "humanresource") {
    return "glamhumanresourceindexvector";
  } else if (containerName === "glamfilecontainer") {
    return "galmindexvector1";
  }
  return null;
};
  useEffect(() => {
    // Track page view when location changes
    const eventData = { event: 'Qnapage' };
    trackEvent(eventData);
 
    // Dispatch action to add tracking data to Redux store
    dispatch(addTrackingData(eventData));
  }, [trackEvent, dispatch]);
 
  // Redux state selector to access conversation
  const conversation = useSelector((state) => state.conversation);
 
  // Redux dispatch function
 
  // const apiUrl =
  // `https://onelogicaoai.openai.azure.com/openai/deployments/gpt-35-turbo-16k/extensions/chat/completions?api-version=2023-07-01-preview`; // Replace with your API endpoint

 
 
  useEffect(() => {
    // Call the initialization function when the component mounts
    initializeSearch()
    for (const containerName of accessibleContainers) {
      console.log("containername",containerName)
      const index = getIndexName(containerName);
      if (index) {
        setIndexName(index);
      }
    }
    getIndexName()
  }, [accessibleContainers,indexName]);

  // Function to scroll the chat container to the bottom
 

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

 
  const handleResetAll = () => {
    cancelBotResponseRequest()
    setMessages([]);
    setUserInput("");
    setShowIntroText(true);
    setCitationContent("");
    setGridSize({ lg: 11.5 });
    dispatch(clearMessages());
    setIsPrintingResponse(false);
    setIsGeneratingResponse(false);
    
    // const eventData = { event: 'buttonClick', status: 'handleResetAll button click  successfull' };
    // // Dispatch action to add tracking data to Redux store
    // dispatch(addTrackingData(eventData));
    // isPrintingResponse(false)
  };
  const handleKeyPress = (event) => {
    setIsTyping(true);
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event); // Call handleSubmit when Enter is pressed (without Shift)
    }
    setShowIntroText(false);
  };
 
 
  const typedRef = useRef(null);
  const [stopClicked, setStopClicked] = useState(false);
 
  const handleStop = () => {
    if (typedRef.current) {
      typedRef.current.stop();
      setStop(true);
      setStopClicked(true); // Set stopClicked to true when stop icon is clicked
 
      // Wait for a brief moment to ensure the animation fully stops
      setTimeout(() => {
        const renderedContent = typedRef.current.pause.curString.slice(
          0,
          typedRef.current.pause.curStrPos
        );
 
        // Replace only the content of the last message in the array
        const updatedMessages = [...conversation]; // Changed 'prevMessages' to 'conversation'
        if (updatedMessages.length > 0) {
          const lastMessageIndex = updatedMessages.length - 1;
          const lastMessageTimestamp = updatedMessages[lastMessageIndex].timestamp; // Get the timestamp of the last message
 
          updatedMessages[lastMessageIndex].content = renderedContent;
          updatedMessages[lastMessageIndex].stop = true; // Change stop flag to true for the last message
          updatedMessages[lastMessageIndex].timestamp = lastMessageTimestamp; // Ensure the timestamp remains unchanged
        }
 
        // Dispatch action to update conversation
        dispatch(addMessage(updatedMessages));
 
        setIsPrintingResponse(false); // Move setIsPrintingResponse here
      }, 100); // Adjust the delay as needed
    }
    const eventData = { event: 'stopbuttonclick', status: 'stop button click successful' };
    // Dispatch action to add tracking data to Redux store
    dispatch(addTrackingData(eventData));
  };
 
 
 
 
 
 
  const handleSubmit = (e) => {
    e.preventDefault();
   
    if (!userInput.trim() || isGeneratingResponse) return; // Prevent sending empty messages or sending multiple requests
   
    setIsLoading(true);
    setIsPrintingResponse(true);
    setIsGeneratingResponse(true); // Set isGeneratingResponse to true
 
    // Get the current timestamp
    const timestamp = new Date().toISOString();
   
    // Add user input to messages with timestamp
    const updatedMessages = [
      ...messages,
      { role: "user", content: userInput, timestamp }
    ];
    setMessages(updatedMessages);
   
    // Use addMessage function from context to update conversation state
    addMessage({ role: "user", content: userInput, timestamp });
   
    dispatch(addMessage({ role: "user", content: userInput, timestamp })); // Update Redux conversation
   
    // Clear the input field immediately
    setUserInput(""); // Clear the input field
   
    // Send user input to the API and receive bot response

    fetchBotResponse(userInput,dispatch,indexName,addTrackingData)
      .then(([botContent, botCitation]) => {
        // Add bot response and citation to messages with timestamp
        updatedMessages.push({
          role: "bot",
          content: botContent,
          citation: botCitation,
          timestamp: new Date().toISOString()
        });
        setMessages(updatedMessages);
       
        // Update conversation stored in Redux
        dispatch(
          addMessage({
            role: "bot",
            content: botContent,
            citation: botCitation,
            stop: false,
            timestamp: new Date().toISOString()
          })
        );
       
        // Finally, set isLoading and isGeneratingResponse to false after receiving the response
        setIsLoading(false); // Set isLoading to false when the response is received
        setIsGeneratingResponse(false); // Set isGeneratingResponse to false after receiving the response
        setShowIntroText(false);
        const eventData = { event: 'buttonClick', status: 'handleSubmit button click  successfull' };
        // Dispatch action to add tracking data to Redux store
        dispatch(addTrackingData(eventData));
 
      })
      .catch((error) => {
        console.error("Error fetching bot response:", error);
        // Handle error - display a message to the user or retry, etc.
      });
  };
 
 
  const handleCloseCitation = () => {
    // Reset citation content and update grid size
    setCitationContent("");
    setGridSize({ lg: 11.5 });
    // const eventData = { event: 'buttonClick', status: 'handleCloseCitation button click  successfull' };
    // // Dispatch action to add tracking data to Redux store
    // dispatch(addTrackingData(eventData));
  };
 
  const handleLinkClick = (content, response) => {
    // Display only the citation content when the link is clicked
    // console.log("content", content)
    setCitationContent(content);
    setResponse(response);
    // console.log("citations", JSON.parse(content).citations);
    // Update grid size when citation link is clicked
    setGridSize({ lg: 7.5 });
    // const eventData = { event: 'buttonClick', status: 'handleLinkClick button click  successfull' };
    // // Dispatch action to add tracking data to Redux store
    // dispatch(addTrackingData(eventData));
  };
 

  // console.log("conversation",conversation)
  const isNewMessage = (msg) => {
    // Check if the message exists in the messages state
    return !messages.some((existingMsg) =>
      existingMsg.content === msg.content && existingMsg.timestamp === msg.timestamp
    );
  };
 
 
  // Function to handle sharing
  const handleShare = (text) => {
    // Logic to share the provided text via the browser's native share functionality
    if (navigator.share) {
      navigator
        .share({
          title: "Share",
          text: text,
        })
        .then(() => {
          // Dispatch action to track successful share
          // const eventData = { event: 'buttonClick', status: 'Share successful' };
          // dispatch(addTrackingData(eventData));
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          // Dispatch action to track share error
          // const eventData = { event: 'buttonClick', status: 'Error sharing: ' + error.message };
          // dispatch(addTrackingData(eventData));
        });
    } else {
      console.log("Web Share API is not supported");
      // Optionally, provide a fallback mechanism or UI for sharing
    }
  };
 
 
  const handleRegenerateAnswer = (index, userInput) => {
    setIsGeneratingResponse(true); // Set generating response to true
    // setIsLoading(true);
    const timestamp = new Date().toISOString();
    const updatedMessages = [...conversation];

    // Remove the last bot response
    if (updatedMessages.length > 0 && updatedMessages[index]?.role === "bot") {
        updatedMessages.splice(index, 1); 
    }

    // Update the Redux store to remove the last bot response
    dispatch(clearMessages()); // Clear all messages from Redux
    updatedMessages.forEach(msg => dispatch(addMessage(msg))); // Re-add all messages except the removed one

    // Make API call to fetch new response
    fetchBotResponse(conversation[index-1].content, dispatch, indexName, addTrackingData)
      .then(([botContent, botCitation]) => {
        // Insert the new bot response at the same index
        updatedMessages.splice(index, 0, {
          role: "bot",
          content: botContent,
          citation: botCitation,
          timestamp: new Date().toISOString()
        });

        setMessages(updatedMessages);

        // Update conversation stored in Redux with the new bot response
        dispatch(
          addMessage({
            role: "bot",
            content: botContent,
            citation: botCitation,
            stop: false,
            timestamp: new Date().toISOString()
          })
        );

        // Finally, set isLoading and isGeneratingResponse to false after receiving the response
        setIsLoading(false); // Set isLoading to false when the response is received
        setIsGeneratingResponse(false); // Set isGeneratingResponse to false after receiving the response
        setShowIntroText(false);
        const eventData = { event: 'buttonClick', status: 'handleRegenerateAnswer button click successful' };
        dispatch(addTrackingData(eventData));
      })
      .catch((error) => {
        console.error("Error fetching bot response:", error);
        // Handle error - display a message to the user or retry, etc.
      });
};

  const handleCopyText = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setOpenSnackbar(true); // Open the snackbar when text is copied successfully
        // Dispatch tracking event for successful text copy
        const eventData = { event: 'buttonClick', status: 'Text copied successfully' };
        dispatch(addTrackingData(eventData));
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
        // Optionally, show an error message
        // Dispatch tracking event for text copy error
        const eventData = { event: 'buttonClick', status: 'Failed to copy text: ' + error.message };
        dispatch(addTrackingData(eventData));
      });
  };
 
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
 
  const handleClick = () => {
    setOpenSnackbar(true);
  };


 // Function to strip Markdown syntax and handle newlines
const stripMarkdown = (markdownContent) => {
  return markdownContent
    .replace(/[*_~`#>!\[\]\(\)]/g, '') // Removes basic Markdown symbols
    .replace(/\n+/g, ' ')              // Replaces newlines with spaces
    .trim();                            // Removes trailing spaces
};
const messageEndRef = useRef(null);

useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth',Block:'end' });
  }
}, [conversation, isLoading]);

 const containerRef = useRef(null);


  const handleTypingComplete = () => {
      // Automatically scroll to the bottom when typing is complete
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth',Block:'end' });
      }
    setIsPrintingResponse(false);
    setStopClicked(false); // Set stopClicked to true when stop icon is clicked
    // Set isPrintingResponse to false when typing is complete
    // const eventData = { event: 'buttonClick', status: 'handleTypingComplete button click  successfull' };
    // // Dispatch action to add tracking data to Redux store
    // dispatch(addTrackingData(eventData));
  };
  useEffect(() => {
    // Scroll to the bottom as typing occurs
    const typedInstance = typedRef.current;
    if (typedInstance && containerRef.current) {
      const handleScroll = () => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      };

      // Add an interval to periodically scroll as typing occurs
      const intervalId = setInterval(handleScroll, 50);

      // Clear the interval when the typing is complete
      typedInstance.el.addEventListener('typedComplete', () => {
        clearInterval(intervalId);
      });

      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);

 
  return (
    <div>
      <Grid container className="Qna_citation" spacing={2} >
        <Grid item xs={12} lg={gridSize.lg} xl={gridSize.lg} md={gridSize.lg} >
          <div className="qna-bot-container" style={{backgroundColor:backgroundColor}}>
            <div className="message-container" style={{ height: "100%"}}>
              <div className="message-container-main"  style={{background:backgroundColor,color:color}}>
                {conversation.length === 0 && (
                  <Typography
                    variant="body1"
                    style={{
                      textAlign: "center",
                      position: "absolute",
                      top: isSmallScreen
                        ? "25%"
                        : isMediumScreen
                          ? "33%"
                          : "40%",
                      left: isSmallScreen
                        ? "20%"
                        : isMediumScreen
                          ? "22%"
                          : "25%",
                      padding: "20px",
                      backgroundColor: backgroundColor,
                      borderRadius: "8px",
                      boxShadow: "0 1px 10px rgba(0, 0, 0, 0.1)",
                      // margin: "22% auto",
                      maxWidth: "50%",
                      color: "grey",
                    }}
                  >
                    {t('askquestion')}
                  </Typography>
                )}
                {conversation.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>


                    {msg.role === "user" && (
                      <div className="user-message">
                        <div
                          style={{
                            padding: "14px",
                            borderRadius: "15px 15px 0px 15px",
                            // boxShadow: "grey 1px 2px 6px",
                            background: "rgb(229 237 240)",
                            width: "fit-content",
                            color: "black",
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    )}
                    {msg.role === "bot" && (
                      <div
                        className="bot-message"
                        style={{ textAlign: "left" , maxWidth:'80%'}}
                      >
                        <div style={{ borderRadius: "8px" , wordBreak: 'break-word',overflowWrap: 'break-word', fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',fontSize:'12px'}}>
                          {isNewMessage(msg) ? ( // Check if it's a new message
                         <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }}  />
                          ) : (
                            <ReactTyped
                              strings={[msg.content]}
                              typeSpeed={10}
                              cursorChar=""
                              stopped={false}
                              startWhenVisible={false}
                              typedRef={(typed) => (typedRef.current = typed)}
                              onStringTyped={handleTypingComplete}
                            />
                          )}
                        </div>
                        {!msg.content.toLowerCase().includes("i'm sorry") &&
                          !msg.content.toLowerCase().includes("sorry,") &&
                          msg.citation &&
                          msg.citation.length !== 0 ? (
                          <>
                            <hr
                              style={{
                                margin: "8px 8px",
                                border: "none",
                                height: "1px",
                                color:color,
                                background:
                                  "linear-gradient(to right, rgb(191 236 255), rgba(0, 0, 0, 0.2), rgb(191 236 255))",
                              }}
                            />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <a
                                href="#"
                                onClick={() =>
                                  handleLinkClick(msg.citation, msg.content)
                                }
                                style={{
                                  textDecoration: "none",
                                  color: "#3e98d3",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  marginLeft: "8px",
                                  fontSize: "14px",
                                  color:color
                                }}
                              >
                                {t('citation')}
                              </a>

                              <div>
                                <div>
                                  {!msg.stop &&
                                    <LikeButton content={msg.content} />
                                  }
                                  <CopyIcon
                                    onClick={() =>
                                      handleCopyText(msg.content)
                                    } // Pass message content to copy handler
                                    style={{
                                      width: "15px",
                                      color: "grey",
                                      cursor: "pointer",
                                      marginLeft: "8px",
                                    }}
                                  />
                                  <Snackbar
                                    open={openSnackbar}
                                    autoHideDuration={1000}
                                    onClose={handleCloseSnackbar}
                                    message="Text copied to clipboard"
                                    ContentProps={{
                                      style: {
                                        minWidth: "10px",
                                      },
                                    }}
                                  />
                                  {/* Share icon */}
                                  <ShareIcon
                                    onClick={() =>
                                      handleShare(msg.content)
                                    } // Pass message content to share handler
                                    style={{
                                      width: "15px",
                                      color: "grey",
                                      cursor: "pointer",
                                      marginLeft: "8px",
                                    }}
                                  />
                                  {/* Regenerate answer icon */}
                                  {index === conversation.length - 1 && (
                                  <RegenerateIcon
                                    onClick={() =>
                                      handleRegenerateAnswer(
                                        index,
                                        msg.content
                                      )
                                    } // Pass message content to regenerate handler
                                    style={{
                                      width: "15px",
                                      color: "grey",
                                      cursor: "pointer",
                                      marginLeft: "8px",
                                    }}
                                  />
                                     )}
                                </div>
                                {/* )}  */}
                              </div>

                            </div>
                          </>
                        ) : null}
                      </div>
                    )}
                    {index === conversation.length - 1 && isLoading && (
                      <div className="loading-message">
                        <img
                          src={loadingIcon}
                          className="loadingicon"
                          alt="icon"
                        />
                      </div>
                    )}
                  </div>
                ))}
                 <div ref={messageEndRef} />
              </div>

              <div className="inputbox">
                <TextField
                  disabled={isGeneratingResponse}
                  className="textFieldQnA"
                  style={{
                    marginTop: "8px",
                    marginBottom: "10px",
                    background:backgroundColor,
                    borderRadius: "10px",
                    width: isSmallScreen ? "100%" : "52vw",
                    color:color
                    // borderBottom: "3px solid #3e98d3",
                  }}
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  value={userInput}
                  onChange={handleUserInput}
                  placeholder="Input Text"
                  onKeyDown={handleKeyPress}
                  InputProps={{
                    style: { borderRadius: "10px" },
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={handleSubmit}
                        style={{ cursor: "pointer" }}
                      >
                        <RestartAltIcon
                          onClick={handleResetAll}
                          style={{
                            cursor: "pointer",
                            marginRight: "20px",
                            color: "black",
                          }}
                        />
                        {isPrintingResponse ? ( // Conditionally render based on response printing
                          <StopIcon onClick={handleStop} />
                        ) : (
                          <Send />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </Grid>
        {citationContent && (
          <Grid item xs={12} lg={4} md={4} sm={12}>
            <Box className="citationBox" >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  // marginBottom: "8px",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{
                    marginLeft: "10px",
                    fontWeight: "700",
                    fontSize: "18px",
                    color:color
                  }}
                >
                  {t('citation')}
                </Typography>
                <Close
                  onClick={handleCloseCitation}
                  style={{ cursor: "pointer", color: "#3e98d3",fontSize:"20px" }}
                />
              </Box>
              <Typography
                component="p"
                style={{
                  margin: "5px",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                }}
              >
                {/* {citationContent} */}
                <Citations citations={citationContent} response={response} />
              </Typography>
            </Box>
          </Grid>
        )} 
      </Grid>


    </div>
  );
};

export default DeployedQndA;
