'use client';
import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children, initialValue = {} }) => {
  const [appcontext, setAppContext] = useState(initialValue);

  return (
    <AppContext.Provider value={{ appcontext, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
