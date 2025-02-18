// src/context/AlertContext.js
import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = (msg) => setMessage(msg);
  const hideMessage = () => setMessage(null);

  return (
    <AlertContext.Provider value={{ message, showMessage, hideMessage }}>
      {children}
    </AlertContext.Provider>
  );
};
