import React, { useEffect, useRef } from 'react';
import { DirectLine, createDirectLine, createStore } from 'botframework-webchat';
import './pvcbot.css';
import env from '../../../../../config';

const BotChat = () => {
  const webChatRef = useRef(null);

  useEffect(() => {
    const directLine = createDirectLine({
      token: env.chatbot, // Use the App Password obtained from Bot Channels Registration
    });

    const store = createStore();

    const styleOptions = {
      botAvatarInitials: 'Bot',
      userAvatarInitials: 'You',
      bubbleBackground: '#d6e8ee', // Background color for bot responses
      bubbleTextColor:'#02457a',
      bubbleBoxShadow:'grey 1px 2px 6px',
      bubbleBorderRadius:"9px",
      bubbleFromUserBackground: '#d2c3ce', // Background color for user input
      bubbleFromUserTextColor:'#7e0e80',
      bubbleFromUserBoxShadow:'#b991c2 1px 2px 3px',
      bubbleFromUserBorderRadius:"9px",
      bubbleNubOffset: '20px', // Radius for bot response box
      basictranscriptBackground: 'red'
    };

    webChatRef.current = window.WebChat.renderWebChat(
      {
        directLine: directLine,
        userID: 'YOUR_USER_ID', // Unique user ID
        store: store,
        styleOptions: styleOptions,
      },
      document.getElementById('webchat')
    );
    // console.log("kl",webChatRef.current )
    return () => {
      webChatRef.current && webChatRef.current.destroy();
    };
  }, []);

  const sendMessage = () => {
    const userMessage = 'hi'; // Message sent by the user
    webChatRef.current && webChatRef.current.postActivity({ type: 'message', text: userMessage, from: { id: 'user' } });
  };

  return (
    <div className='newbot' >
      <div id="webchat" style={{ width: '100%', height: '100%', backgroundColor: 'grey' }}></div>
      {/* <button onClick={sendMessage}>Send Message</button> */}
    </div>
  );
};

export default BotChat;
