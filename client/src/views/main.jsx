import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext.jsx';

const Main = () => {
    const navigate = useNavigate();
    const { name, setName } = useContext(UserContext); // Use the UserContext

    const onChangeHandler = (e) => {
        setName(e.target.value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate('/avatar');
    }

    return (
        <div>
            <h1>Welcome To</h1>
            <img src='madlibs-696x230.png' alt='madlibs' />
            <h3>Enter a name to begin!</h3>
            <form onSubmit={onSubmitHandler}>
                <input type="text" name="name" value={name} onChange={onChangeHandler} />
                <input type="submit" value="Start Madlibs" />
            </form>
        </div>
    )
}

export default Main;
