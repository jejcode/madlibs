import React, { createContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => { 
    const [name, setName] = useState("");
    console.log(name);
    const [selectedColor, setSelectedColor] = useState(""); // Add selectedColor state

    return (
        <UserContext.Provider value={{ name, setName, selectedColor, setSelectedColor }}>
            {children} 
        </UserContext.Provider>
    );
};

export default UserProvider;
