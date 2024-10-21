import React, { useRef, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactWebChat, { createDirectLine, createCognitiveServicesSpeechServicesPonyfillFactory } from 'botframework-webchat';
import './pvcbot.css';
import './PvtMedia.css';
import env from '../../../../../config';
import { ThemeContext } from "../../../header/ThemeContext";
import Modal from '../../../../Modal';
import TimeoutModal from './TimeoutModal'; // Import the timeout modal
import { Close, Menu } from '@mui/icons-material';

const PowerVirtualAgent = ({ className }) => {
  const [directLineToken, setDirectLineToken] = useState(null);
  const [directLine, setDirectLine] = useState(null);
  const { theme } = useContext(ThemeContext);
  const backgroundColor = theme === "dark" ? "#333" : "#fff";
  const color = theme === "dark" ? "white" : "";
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTimeoutModalOpen, setTimeoutModalOpen] = useState(false); // State to show timeout modal
  const [parentWidth, setParentWidth] = useState(null); // State to store parent width
  const parentDivRef = useRef(null); // Ref for parent div
  const timeoutRef = useRef(null); // Ref to store the timeout

  useEffect(() => {
    if (parentDivRef.current) {
      setParentWidth(parentDivRef.current.offsetWidth); // Get parent div width
    }
  }, [parentDivRef.current, isModalOpen]); // Recalculate on modal open or parent div resize

  useEffect(() => {
    const fetchDirectLineToken = async () => {
      try {
        const response = await axios.post(`${env.api}/api/directlinetoken`);
        const token = response.data.token;
        setDirectLineToken(token);
      } catch (error) {
        console.error('Failed to fetch Direct Line token:', error);
      }
    };

    fetchDirectLineToken();
  }, []);

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

  const startTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timeout
    }
    timeoutRef.current = setTimeout(() => {
      setTimeoutModalOpen(true); // Open the timeout modal after 6 seconds of inactivity
    }, 6000); // 6 seconds timeout
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear timeout when response is received
    }
    setTimeoutModalOpen(false); // Ensure modal is closed when response arrives
  };

  useEffect(() => {
    if (directLine) {
      const botConnection = directLine.activity$.subscribe((activity) => {
        if (activity.from.role === 'bot') {
          resetTimeout(); // Reset timeout on bot response
        } else if (activity.from.role === 'user') {
          startTimeout(); // Start timeout when the user sends a message
        }
      });

      return () => botConnection.unsubscribe(); // Cleanup subscription on unmount
    }
  }, [directLine]);

  const styleOptions = {
    bubbleBackground: 'none',
    hideSendBox: false,
    bubbleTextColor: '#02457a',
    bubbleBoxShadow: 'grey 1px 2px 6px',
    bubbleBorderRadius: '9px',
    bubbleFromUserBackground: 'linear-gradient(90deg, rgb(11 11 44 / 90%) 35%, rgb(33 79 172 / 41%) 100%)',
    bubbleFromUserTextColor: '#fff',
    bubbleFromUserBoxShadow: '#b991c2 1px 2px 3px',
    bubbleFromUserBackground: 'linear-gradient(90deg, rgb(6 73 180 / 93%) 35%, rgb(33 79 172 / 41%) 100%)',
    bubbleFromUserBorderRadius: '9px',
    bubbleNubOffset: '20px',
    userAvatarImage: 'https://avatarbot.blob.core.windows.net/container/4bc462ce769560c4d042ef586a398f4c.jpg',
    botAvatarImage: 'https://avatarbot.blob.core.windows.net/container/ef03c9fde1ca302311dceed7c277be58.jpg',
    timestampFormat: 'relative',
    backgroundImage: 'url(https://img.freepik.com/premium-photo/bank-illustration-clip-art-vector_1003030-4862.jpg?w=360)',
    backgroundColor: backgroundColor,
    color: color
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleOptionSelect = (option) => {
    if (directLine) {
      directLine.postActivity({
        from: { id: 'YOUR_USER_ID', name: 'YOUR_USERNAME' },
        type: 'message',
        text: option,
      }).subscribe(
        id => console.log(`Message sent with id ${id}`),
        error => console.error(`Error sending message: ${error}`)
      );
    }
  };

  const handleTimeoutContinue = () => {
    setTimeoutModalOpen(false); // Close the modal when the user chooses to continue
    startTimeout(); // Restart the timer
  };

  const handleTimeoutRestart = () => {
    setTimeoutModalOpen(false); // Close the modal
    handleOptionSelect('restart'); // Send a restart command
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

          <div className="webchat__send-box" style={{ border: "none" }}>
            <div className="menu" onClick={toggleModal} style={{ height: "12.6vh" }}>
              {isModalOpen ? <Close style={{ fontSize: '1.8rem', marginBottom: "6px" }} /> : <Menu style={{ fontSize: '1.8rem', marginBottom: "6px" }} />}
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

      {/* Timeout Modal */}
      <TimeoutModal
        isOpen={isTimeoutModalOpen}
        onClose={() => setTimeoutModalOpen(false)}
        onContinue={handleTimeoutContinue}
        onRestart={handleTimeoutRestart}
        width={parentWidth}
      />
    </div>
  );
};

export default PowerVirtualAgent;
