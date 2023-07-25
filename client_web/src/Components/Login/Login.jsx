import React, { useContext } from "react";
import { useEffect, useState,useRef } from 'react';
import {useNavigate,Navigate } from "react-router-dom";
import "./Login.css"

import { NavLink} from "react-router-dom";
import {authentication } from "../../firebase-otp";
import {RecaptchaVerifier ,signInWithPhoneNumber } from "firebase/auth";
import { AppContext } from "../../style/context/AppContext";
import socket from "../../socket/socket";

const Login=()=>{
    const {setUserlogin}= useContext(AppContext);
    const navigate = useNavigate();
    const countryCode = "+84";
    const [phoneNumber,setPhoneNumber] =useState(countryCode);
    const [expandForm,setExpandForm] =useState(false);
    const [OTP,setOTP]=useState('');
    const [user,setUser]=useState('');
    const generrateRecapcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
            }
          }, authentication);
    }
   const reqestOTP =(e)=>{
    e.preventDefault();
    //// checkuser
    if(phoneNumber>=11){
        socket.emit("joinRoom", phoneNumber);
        socket.emit("loginadmin",phoneNumber);
        socket.on("loginAD",(data)=>{
            if(data!==null){
                    setUser(data);
                    setUserlogin(data)
                    generrateRecapcha();
                    signInWithPhoneNumber(authentication,phoneNumber,window.recaptchaVerifier)
                    .then(Result=>{
                        window.confirmationResult = Result;
                        setExpandForm(true);
                    }).catch((error)=>{
                        alert("Your account will be locked in a few hours")
                    })
            }
        })
    }
   }
   const checkOTP = (e)=>{
    let otp =e.target.value;
    setOTP(otp);
    if(otp.length===6){
        let confirmationResult =window.confirmationResult;
        try {
            confirmationResult.confirm(otp).then((result)=>{
                localStorage.setItem("accessToKen",JSON.stringify(user))
                localStorage.setItem("accessToKenHome",JSON.stringify(user.homeId[0]))
                navigate("/")
            }).catch((error)=>{
                console.log("Your otp code is incorrect")
            })
        } catch (error) {
            alert("Please review the connection")
        }
        
    }
   }
   if(localStorage.getItem("accessToKen")!==null){
    return <Navigate replace to="/"/>
   }else{
    return(
        <div className="backgoundbody">
            <h1 className="slg">Samrt Home Inifinity</h1>
        <section className="loginContainer">
         <form onSubmit={reqestOTP}>
             <h1>Sign in</h1>
             <div className="txt_field">
                 <input type="tel" className="form-control" id="phoneNumberInput" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
                 <label htmlFor="phoneNumberInput" className="form-label">Phone number</label>
             </div>
             {expandForm===true?
             <>
                 <div className="txt_field">
                     <input type="number" className="form-control" id="otpInput" value={OTP} onChange={checkOTP}/>
                     <label htmlFor="otpInput" className="form-label">OTP</label>
                 </div>
             </>:null}
             {
                 expandForm===false?
                 <button type="submit" className="btn btn-primary">Request OTP</button>
                 :null
             }
             <div id="recaptcha-container"></div>
         </form>
        </section>
        </div>
     )
   }


}
export default Login;