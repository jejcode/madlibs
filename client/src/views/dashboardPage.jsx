import React, { useContext, useState} from "react";
import Dashboard from "../components/dashboard";
import UserProvider from "../components/UserContext";

const DashboardPage = ({ socket }) => {
    const context = useContext(UserProvider)

    return (
        <Dashboard />    
    )
}

export default DashboardPage;