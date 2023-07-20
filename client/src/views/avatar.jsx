import React, { useState } from 'react';

const Main = (props) => {
    return (
        <div>
            <h1>Welcome To</h1>
            <img src='/madlibs-696x230.png' alt='madlibs' />
            <h3>Choose an avatar:</h3>
            <form onSubmit={props.onSubmitHandler}>
                <div style={{display: "flex", justifyContent: "center"}}>
                <table>
                    <tbody>
                        <tr>
                        <td><a href=''><img src="/blue_icon.png" alt="blue" /></a></td>
                        <td><a href=''><img src="/red_icon.png" alt="red" /></a></td>
                        <td><a href=''><img src="/yellow_icon.png" alt="yellow" /></a></td>
                        </tr>
                        <tr>
                        <td><a href=''><img src="/green_icon.png" alt="green" /></a></td>
                        <td><a href=''><img src="/purple_icon.png" alt="purple" /></a></td>
                        <td><a href=''><img src="/grey_icon.png" alt="grey" /></a></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </form>
        </div>
    )
}

export default Main;
