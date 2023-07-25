import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../SideBar Section/Sidebar";
import '../../style/base/reset.css';
import { AppContext } from "../../style/context/AppContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";



const Layout = ({ users }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem("accessToKen"));
    const { themeStyle } = useContext(AppContext);
    useEffect(() => {
        const user = localStorage.getItem("accessToKen");
        if (!user) {
            navigate("/Login")
        }
    }, [user]);
    if (!user) {
        <Navigate replace to="/Login" />
    } else {
        return (
            <div className="layout">
                <div className="container">
                    <div className={themeStyle}>
                        <div className="container">
                            <Sidebar />
                            <div className="mainContent">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}
export default Layout 