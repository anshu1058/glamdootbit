import React, { useEffect, useRef, useState ,useMemo } from 'react';
import axios from 'axios';
import ReactWebChat, { createDirectLine, createStore,createCognitiveServicesSpeechServicesPonyfillFactory } from 'botframework-webchat';
import './pvcbot.css';
import './PvtMedia.css';
import env from '../../../../../config';

const PowerVirtualAgent = ({ className, onFetchToken, store,  token }) => {
  const directLine = useMemo(() => createDirectLine({ token:'BeFx4v5Q_kc.P7zSbZ9KS3qv6R0Ie4KODfKUZqj53BIQnOI9yfap1VI' }), [token]);

  useEffect(() => {
    onFetchToken();
  }, [onFetchToken]);
  const styleOptions = {
    bubbleBackground: 'none',
    hideSendBox: false,
    bubbleTextColor: '#02457a',
    bubbleBoxShadow: 'grey 1px 2px 6px',
    bubbleBorderRadius: '9px',
    bubbleFromUserBackground: '#B5CFFF',
    bubbleFromUserTextColor: '#242424',
    bubbleFromUserBoxShadow: '#b991c2 1px 2px 3px',
    bubbleFromUserBorderRadius: '9px',
    bubbleNubOffset: '20px',
    basictranscriptBackground: 'red',
    userAvatarImage: 'https://avatarbot.blob.core.windows.net/container/4bc462ce769560c4d042ef586a398f4c.jpg',
    botAvatarImage: 'https://avatarbot.blob.core.windows.net/container/ef03c9fde1ca302311dceed7c277be58.jpg',
    timestampFormat: 'relative',
    backgroundImage:
      'url(https://img.freepik.com/premium-photo/bank-illustration-clip-art-vector_1003030-4862.jpg?w=360)',
  };


  // useEffect(() => {
  //   onFetchToken();
  // }, [onFetchToken]);

  // const fetchSpeechServicesCredentials = async () => {
  //   try {
  //     const res = await fetch('https://webchat-mockbot.azurewebsites.net/speechservices/token', {
  //       method: 'POST',
  //     });
  //     if (!res.ok) {
  //       throw new Error('Failed to fetch speech services credentials');
  //     }
  //     const { region, token } = await res.json();
  //     return {
  //       region,
  //       authorizationToken: token,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching speech services credentials:', error);
  //     return null;
  //   }
  // };

  // const webSpeechPonyfillFactory = useMemo(() => {
  //   return createCognitiveServicesSpeechServicesPonyfillFactory({
  //     credentials: fetchSpeechServicesCredentials,
  //   });
  // }, []);


  return token ? (
    <div className='newOLbot' style={{ height: '78.5vh' }}>
    <ReactWebChat
      className={`${className || ''} web-chat`}
      id="webchat" 
      directLine={directLine}
      store={store}
      styleOptions={styleOptions}
      // renderSendBox={(props) => <SendBox {...props} />}
      // webSpeechPonyfillFactory={webSpeechPonyfillFactory}
    />

  
    </div>
  ) : (
    <div className='newOLbot' style={{ height: '78.5vh' }}>

    </div>
  );
};

export default PowerVirtualAgent;