import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../components/UserContext.jsx';

const Avatar = () => {
    const { selectedColor, setSelectedColor } = useContext(UserContext);

    const handleAvatarClick = (color) => {
        setSelectedColor(color);
        console.log(color);
    }

    return (
        <div>
            <h1>Welcome To</h1>
            <img src='../assets/images/madlibs-696x230.png' alt='madlibs' />
            <h3>Choose an avatar:</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <table>
                    <tbody>
                        <tr>
                            <td><Link to="/dashboard" onClick={() => handleAvatarClick('blue')}><img src='../assets/images/blue_icon.png' alt="blue" /></Link></td>
                            <td><Link to="/dashboard" onClick={() => handleAvatarClick('red')}><img src="../assets/images//red_icon.png" alt="red" /></Link></td>
                            <td><Link to="/dashboard" onClick={() => handleAvatarClick('yellow')}><img src="../assets/images//yellow_icon.png" alt="yellow" /></Link></td>
                        </tr>
                        <tr>
                            <td><Link to="/dashboard" onClick={() => handleAvatarClick('green')}><img src="../assets/images//green_icon.png" alt="green" /></Link></td>
                            <td><Link to="/dashboard" onClick={() => handleAvatarClick('purple')}><img src="../assets/images//purple_icon.png" alt="purple" /></Link></td>
                            <td><Link to="/dashboard" onClick={() => handleAvatarClick('grey')}><img src="../assets/images//grey_icon.png" alt="grey" /></Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Avatar;
