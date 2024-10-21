import React, { useEffect } from 'react';
import { createDirectLine, createStore, renderWebChat } from 'botframework-webchat';

const TestBot = () => {
  useEffect(() => {
    const directLine = createDirectLine({ token: '-BowE3c2R9c.meKCMxNoq22JsxgbWe1jTmd1IE--15L3WX9EnojBKpM' });
    const store = createStore();
    renderWebChat({
      directLine: directLine,
      store: store,
      userID: 'YOUR_USER_ID',
      username: 'YOUR_USERNAME',
      locale: 'en-US', // Change as per your requirement
      styleOptions: {
        // Customize style options if needed
      },
    }, document.getElementById('webchat'));
  }, []);

  return <div id="webchat" />;
};

export default TestBot;
