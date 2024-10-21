// BotTest.js
import React, { useState, useEffect } from 'react';
import { createDirectLine, createStore, renderWebChat,createCognitiveServicesSpeechServicesPonyfillFactory} from 'botframework-webchat';
import './BotTest.css'; // Import custom CSS file for styling
import Modal from './Modal';
import { Menu } from '@mui/icons-material';

const BotTest = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [directLine, setDirectLine] = useState(null);

  useEffect(() => {
    const directLine = createDirectLine({ token: 'BeFx4v5Q_kc.P7zSbZ9KS3qv6R0Ie4KODfKUZqj53BIQnOI9yfap1VI' });
    const store = createStore();

    renderWebChat({
      directLine,
      store,
      userID: 'YOUR_USER_ID',
      username: 'YOUR_USERNAME',
      locale: 'en-US',
      webSpeechPonyfillFactory: createCognitiveServicesSpeechServicesPonyfillFactory({
        credentials: {
          region: ' centralindia',
          subscriptionKey: '56789552fd00412fb4cc9407e7a1e8a8'
        }
      }),
      styleOptions: {
        textBox: {
          border: '1px solid #DDD',
          borderRadius: '5px',
          padding: '0 10px', // Adjust padding to accommodate icon
          marginLeft: '40px' // Space for the menu icon
        },
        sendBox: {
          padding: '10px',
          backgroundColor: '#FFFFFF',
          zIndex: 1000, // Higher z-index to stay above the modal
        }
      },
    }, document.getElementById('webchat'));

    setDirectLine(directLine);
  }, []);

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

  return (
    <div className="webchat-container">
      <div id="webchat" className="webchat">
        {/* WebChat area */}
      </div>
      <div className="webchat__send-box">
        <div className="menu" onClick={toggleModal} style={{ height: "6vh" }}><Menu/></div>
      </div>
      {/* Modal should be positioned behind the send box */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={toggleModal} 
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
};

export default BotTest;
