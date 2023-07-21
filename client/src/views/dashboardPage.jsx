import React, { useState} from "react";
import Dashboard from "../components/dashboard";


const DashboardPage = ({ socket }) => {

    return (
        <div>
            <Dashboard socket={ socket } />
        </div>
    )
}

export default DashboardPage;