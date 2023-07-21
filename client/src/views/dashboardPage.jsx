import React, { useState} from "react";
import Dashboard from "../components/dashboard";


const DashboardPage = ({ socket }) => {

    return (
        <div>
            <Dashboard />
        </div>
    )
}

export default DashboardPage;