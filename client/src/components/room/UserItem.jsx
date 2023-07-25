import React from 'react';
import blueAvatar from "../../assets/blue_icon.png";
import redAvatar from "../../assets/red_icon.png";
import yellowAvatar from "../../assets/yellow_icon.png";
import greenAvatar from "../../assets/green_icon.png";
import purpleAvatar from "../../assets/purple_icon.png";
import greyAvatar from "../../assets/grey_icon.png";

const UserItem = ({ name }) => {
    const getAvatarImage = (color) => {
        switch (color) {
            case "blue":
                return blueAvatar;
            case "red":
                return redAvatar;
            case "yellow":
                return yellowAvatar;
            case "green":
                return greenAvatar;
            case "purple":
                return purpleAvatar;
            case "grey":
                return greyAvatar;
            default:
                return greyAvatar; // Default to grey avatar if color is not recognized
        }
    };

    const selectedColor = sessionStorage.getItem('selectedColor');
    const avatar = getAvatarImage(selectedColor);

    return (
        <li>
            <img src={avatar} className='user-icon' alt='User Icon'></img>
            <span> {name} </span>
            <span> {selectedColor} </span>
        </li>
    );
};

export default UserItem;
