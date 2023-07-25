import React, { useEffect } from "react";
import { NavLink,Link, useNavigate, Navigate } from "react-router-dom";
import './Sidebar.css'
import logo from '../../Aseets/logo.png'
import {AiFillHome} from 'react-icons/ai'
import {HiOutlineViewGrid} from 'react-icons/hi'
import {AiOutlineQrcode} from 'react-icons/ai'
import {AiFillSetting} from 'react-icons/ai'
import {SlLogout} from 'react-icons/sl'
import Darkmode from "../Body Section/Top Section/darkmode";
const Sidebar =()=>{
    const navigate =useNavigate();
    const Logoutuser=()=>{
        localStorage.clear();
        navigate("/Login")
    }
    useEffect(() => {
        if (localStorage.getItem("accessToKen")===null) {
            navigate("/Login")
        }
    });
    return(
        <div className="sideBar">
                <NavLink to="/">
                <div className="logoDiv flex">
                <img src={logo} alt="Smart Home" />
                    <h2>CKC IOT</h2>
                </div>
                </NavLink>
                <div className="menuDiv">
                    <h3 className="divTitle">
                        Start My Home
                    </h3>
                    <ul className="menuLists grid">
                        <li className="listItem">
                            <NavLink to="/" className={"menuLink flex"}>
                                <AiFillHome className="icon"/>
                                <span className="smailText">
                                    Home
                                </span>
                            </NavLink>
                        </li>
                        
                        <li className="listItem">
                        <NavLink to="/Room" className={"menuLink flex"}>
                                <HiOutlineViewGrid className="icon"/>
                                <span className="smailText">
                                    Room
                                </span>
                        </NavLink>
                        </li>
                        
                        <li className="listItem">
                        <NavLink to="/Driver" className={"menuLink flex"}>
                                <AiOutlineQrcode className="icon"/>
                                <span className="smailText">
                                    Device Qr
                                </span>
                        </NavLink>
                        </li>
                        <li className="listItem">
                        
                        </li>
                    <br />
                    <br />
                    <br />
                    <li className="listItem">
                        <div onClick={Logoutuser} className={"menuLink flex"}>
                                <SlLogout className="icon"/>
                                <span className="smailText">
                                    Logout
                                </span>
                        </div>
                        </li>    
                    </ul>
                    
                </div>
                
                <div className="sideBarCard">
                    
                    <div className="CardContent">
                        <h3>Help Center</h3>
                        <p>Having trouble in CKC IOT, please contact us from for more questions.</p>
                        <button className="btn"> Go to help center</button>
                    </div>
                </div>
                <div>
                    <Darkmode/>
                </div>
        </div>
    )
}
export default Sidebar