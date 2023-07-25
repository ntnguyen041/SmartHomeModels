import React,{useEffect,useState, useContext}from "react";
import { AppContext } from "../../../style/context/AppContext";
import './darkmode.css'
const Darkmode =()=>{
    const {setIsDay,isDay}=useContext(AppContext);
    const toggoleTheme =()=>{
        localStorage.setItem("setiday","true")
        setIsDay(!isDay)
    }
    return(
        <div className="darkmode">
            <input type="checkbox" id="dark-mode"  value={isDay} onChange={toggoleTheme} checked={isDay}/>
            <label htmlFor="dark-mode"></label>
            <div className="background"></div>
        </div>
    )
}
export default Darkmode