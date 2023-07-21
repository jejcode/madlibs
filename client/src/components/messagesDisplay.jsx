import React from 'react';

const MessagesDisplay = ({ messages }) => {
    console.log(messages);
    return (
        <div>
            <h2>Messages</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.isNewUser ? (
                            <p>{message.text}</p>
                        ) : (
                            <p>
                                <strong>{message.name}:</strong> {message.text}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagesDisplay;
