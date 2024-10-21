import React, { useRef, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactWebChat, { createDirectLine, createCognitiveServicesSpeechServicesPonyfillFactory } from 'botframework-webchat';
import './pvcbot.css';
import './PvtMedia.css';
import env from '../../../../../config';
import { ThemeContext } from "../../../header/ThemeContext";
import Modal from '../../../../Modal';
import { Close, Menu } from '@mui/icons-material';
import plus from './plus.png'
import olbot from '../../../../assets/olbot.png';

const PowerVirtualAgent = ({ className }) => {
  const [directLineToken, setDirectLineToken] = useState(null);
  const [directLine, setDirectLine] = useState(null);
  const { theme } = useContext(ThemeContext);
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? "white" : "";
  const [isModalOpen, setModalOpen] = useState(false);
  const [parentWidth, setParentWidth] = useState(null); // State to store parent width
  const parentDivRef = useRef(null); // Ref for parent div
  const userToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (parentDivRef.current) {
      setParentWidth(parentDivRef.current.offsetWidth); // Get parent div width
    }
  }, [parentDivRef.current, isModalOpen]); // Recalculate on modal open or parent div resize

  useEffect(() => {
    const fetchDirectLineToken = async () => {
      try {
        const response = await axios.post(
          `${env.api}/api/directlinetoken`,
          {}, // No request body, so pass an empty object
          {
            headers: {
              Authorization: `Bearer ${userToken }`, // Add the Bearer token here
            },
          }
        );
        const token = response.data.token;
        setDirectLineToken(token);
      } catch (error) {
        console.error('Failed to fetch Direct Line token:', error);
      }
    };

    fetchDirectLineToken();
  }, [userToken ]); // Add userAuthToken as a dependency to useEffect if it may change

  useEffect(() => {
    if (directLineToken) {
      const createBotDirectLine = async () => {
        try {
          const dl = createDirectLine({ token: directLineToken });
          setDirectLine(dl);
        } catch (error) {
          console.error('Error creating direct line:', error);
        }
      };

      createBotDirectLine();
    }
  }, [directLineToken]);

  const styleOptions = {
    bubbleBackground: '#fcfcfc',
    hideSendBox: false,
    bubbleTextColor: '#02457a',
    bubbleBoxShadow: 'grey 1px 2px 6px',
    bubbleBorderRadius: '25px',
    bubbleFromUserBackground: 'linear-gradient(90deg, rgb(11 11 44 / 90%) 35%, rgb(33 79 172 / 41%) 100%)',
    bubbleFromUserTextColor: '#fff',
    bubbleFromUserBoxShadow: '#b991c2 1px 2px 3px',
    bubbleFromUserBackground: '#005ABC',
    bubbleFromUserBorderRadius: '25px',
    bubbleNubOffset: '20px',
    userAvatarImage: 'https://avatarbot.blob.core.windows.net/container/4bc462ce769560c4d042ef586a398f4c.jpg',
    botAvatarImage: olbot,
    timestampFormat: 'relative',
    backgroundImage: 'url(https://img.freepik.com/premium-photo/bank-illustration-clip-art-vector_1003030-4862.jpg?w=360)',
    backgroundColor: backgroundColor,
    color: color,
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // const handleRefresh = (option) => {
  //   console.log('Handling refresh with option:', option);
  
  //   if (directLine) {
  //     directLine.postActivity({
  //       from: { id: 'YOUR_USER_ID', name: 'raja' },
  //       type: 'message', // Use 'message' type if you want it to appear in the UI
  //       text: option, // The data you want to send as the message text
  //       name: 'hiddenActivity',

  //     }).subscribe(
  //       id => console.log(`Message sent with id ${id}`),
  //       error => console.error(`Error sending message: ${error}`)
  //     );
  //   }
  // };
  // const handleRefresh = (option) => {
  //   console.log('Handling refresh with option:', option);
  
  //   if (directLine) {
  //     directLine.postActivity({
  //       from: { id: 'YOUR_USER_ID', name: 'raja' },
  //       // type: 'event', // Use 'event' type to send hidden activity
  //       type: 'message',
  //       name: 'hiddenActivity', // Custom event name to identify this activity
  //       text: option, // The data you want to send with the event
  //     }).subscribe(
  //       id => console.log(`Hidden activity sent with id ${id}`),
  //       error => console.error(`Error sending hidden activity: ${error}`)
  //     );
  //   }
  // };
  
  
  const handleOptionSelect = (option) => {
    // handleRefresh('restart');
  
    // setTimeout(() => {
      if (directLine) {
        directLine.postActivity({
          from: { id: 'YOUR_USER_ID', name: 'raja' },
          type: 'message',
          text: option,
        }).subscribe(
          id => console.log(`Message sent with id ${id}`),
          error => console.error(`Error sending message: ${error}`)
        );
      }
    // }, 1000); // 1 second delay
  };
  





  const speechToTextPonyfillFactory = createCognitiveServicesSpeechServicesPonyfillFactory({
    credentials: {
      region: 'centralindia',
      subscriptionKey: '56789552fd00412fb4cc9407e7a1e8a8'
    }
  });

  const textToSpeechPonyfillFactory = createCognitiveServicesSpeechServicesPonyfillFactory({
    credentials: {
      region: 'centralindia',
      subscriptionKey: '56789552fd00412fb4cc9407e7a1e8a8'
    }
  });
  return (
    <div ref={parentDivRef} className='newOLbot' style={{ height: '76.5vh' }}>
      {directLine ? (
        <>
          <ReactWebChat
            className={`${className || ''} web-chat`}
            directLine={directLine}
            styleOptions={styleOptions}
            enableTelemtry={false}
            webSpeechPonyfillFactory={() => {
              const { SpeechGrammarList, SpeechRecognition } = speechToTextPonyfillFactory();
              const { speechSynthesis, SpeechSynthesisUtterance } = textToSpeechPonyfillFactory();

              return {
                SpeechGrammarList,
                SpeechRecognition,
                speechSynthesis,
                SpeechSynthesisUtterance,
              };
            }}
          />

          <div className="webchat__send-box">


          <div className="menu" onClick={toggleModal}>
  <img 
    src={plus} 
    alt="Plus Icon" 
    className={`plus-icon ${isModalOpen ? 'rotate' : ''}`} 
    style={{ width: '1.8rem', height: '1.8rem' }} 
  />
</div>

          </div>
        
          <Modal
            isOpen={isModalOpen}
            onClose={toggleModal}
            onOptionSelect={handleOptionSelect}
            width={parentWidth} // Pass the parent width to Modal
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PowerVirtualAgent;
