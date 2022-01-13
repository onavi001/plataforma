import React from 'react'
import RegionsGet from "./RegionsGet.jsx";
function regionsget({...pageProps}){
    //console.log({...pageProps})
    return (
        <RegionsGet {...pageProps} />
    )
}
export default regionsget;