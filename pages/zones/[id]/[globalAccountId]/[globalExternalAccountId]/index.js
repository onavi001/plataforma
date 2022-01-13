import React from 'react'
import ZonesGet from "./ZonesGet.jsx";
function zonesget({...pageProps}){
    //console.log({...pageProps})
    return (
        <ZonesGet {...pageProps} />
    )
}
export default zonesget;