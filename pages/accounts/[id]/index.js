import React, { Component } from 'react'
import AccountsGet from "./AccountsGet.jsx";
import { useRouter } from 'next/router'

function accounts({...pageProps}){
    //const { id } = useRouter().query
    return (
        <AccountsGet {...pageProps}/>
    )
}
export default accounts;
