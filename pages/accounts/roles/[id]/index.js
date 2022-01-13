import React, { Component } from 'react'
import Roles from "./Roles.jsx";

function roles({...pageProps}){
    return (
        <Roles {...pageProps} />
    )
}
export default roles;
