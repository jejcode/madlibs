import React from 'react';

const MessagesDisplay = ({ messages }) => {
    console.log("Message Display:", messages);
    return (
        <div id='MessageDisplay'>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.isNewUser ? (
                            <p>({message.message})</p>
                        ) : (
                            <p>
                                <strong>{message.name}:</strong> {message.message}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagesDisplay;
