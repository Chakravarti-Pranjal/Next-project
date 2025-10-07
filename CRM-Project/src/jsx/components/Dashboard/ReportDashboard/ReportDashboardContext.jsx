import React, { createContext, useState } from 'react';
// Create a Context
export const MyContext = createContext();

// Create a Provider component
export const MyProvider = ({ children }) => {
    const [reportShow, setReportShow] = useState(false)
    

    return (
        <MyContext.Provider value={{ reportShow, setReportShow }}>
            {children}
        </MyContext.Provider>
    );
};