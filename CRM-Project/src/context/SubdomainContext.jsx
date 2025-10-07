// src/context/SubdomainContext.jsx
import React, { createContext, useContext } from "react";
import subdomainConfig from "../config/subdomainConfig";

const SubdomainContext = createContext();

export const SubdomainProvider = ({ children }) => {
  const hostname = window.location.hostname;
  const subdomain = hostname.split(".")[0];
  const config = subdomainConfig[subdomain] || subdomainConfig.default;

  return (
    <SubdomainContext.Provider value={config}>
      {children}
    </SubdomainContext.Provider>
  );
};

// Hook for easy access
export const useSubdomain = () => useContext(SubdomainContext);