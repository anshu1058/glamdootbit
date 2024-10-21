import React, { useEffect, useMemo } from 'react';
import ReactWebChat, { createDirectLine, createStore, createCognitiveServicesSpeechServicesPonyfillFactory } from 'botframework-webchat';

import './daasbot.css';
// import './PvtMedia.css'
// import backimage from './Media-_4_.jpg'

const Daasbot = ({className, onFetchToken, store, token  }) => {
  const directLine = useMemo(() => createDirectLine({     token: '-BowE3c2R9c.meKCMxNoq22JsxgbWe1jTmd1IE--15L3WX9EnojBKpM' }), []);

  useEffect(() => {
    onFetchToken();
  }, [onFetchToken]);


    const styleOptions = {
      
     
      bubbleBackground: 'none',
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
      // botAvatarImage: 'url(path/to/your/bot-avatar-image.jpg)',
      timestampFormat:  'relative',
      // suggestedActionLayout: 'stacked',
      // suggestedActionBorderStyle: '2px solid black',
      backgroundColor: '#F3F3F3',
      

    };

    return token ? (
      <div className='newOLbot' style={{ height: '78.5vh' }}>
        <ReactWebChat
          className={`${className || ''} web-chat`}
          id="webchat" 
          directLine={directLine}
          store={store}
          styleOptions={styleOptions}
          // webSpeechPonyfillFactory={webSpeechPonyfillFactory}
        />
      </div>
    ) : (
      <div className='newOLbot' style={{ height: '78.5vh' }}>
      </div>
    );
  };
export default Daasbot;
