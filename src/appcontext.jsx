'use client';
import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [appcontext, setAppContext] = useState({});

  return (
    <AppContext.Provider value={{ appcontext, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
