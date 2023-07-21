import React, { createContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => { 
    const [name, setName] = useState("");
    console.log(name);
    const [selectedColor, setSelectedColor] = useState(""); // Add selectedColor state
    const [madLib, setMadlib] = useState({})

    return (
        <UserContext.Provider value={{ name, setName, selectedColor, setSelectedColor, madLib, setMadlib }}>
            {children} 
        </UserContext.Provider>
    );
};

export default UserProvider;
