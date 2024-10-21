// ConversationContext.js

import React, { createContext, useState } from 'react';

const ConversationContext = createContext();

export const ConversationProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);

  const addMessage = (message) => {
    setConversation([...conversation, message]);
  };

  return (
    <ConversationContext.Provider value={{ conversation, addMessage }}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationContext;
