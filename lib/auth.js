// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest } from 'next/server'
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
import React, {useEffect,useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
export async function setUserStorage(
    request= NextRequest,
    response= NextResponse
  ) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (typeof window !== "undefined") {

      localStorage.setItem(key, value)
      alert("hoi")
      return NextResponse.redirect('/')
    }else{
      console.log("asd")
      return NextResponse.redirect('/home') 
    }
}