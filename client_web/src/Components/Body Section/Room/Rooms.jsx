import React, { useContext } from 'react'
import { useState, useEffect, useReducer } from 'react';
import socket from '../../../socket/socket';
import "./Rooms.css"
import { NavLink } from 'react-router-dom';
import RoomPage from './RoomPage';
import { AppContext } from '../../../style/context/AppContext';

export default function Rooms() {
    const {listRoom}=useContext(AppContext)
    return (
        <div className="RomContainer">
            
            {listRoom.loading ? "" :
                listRoom.data.map((Room) =>
                    <div key={Room._id} className="singleItem flex">
                        <NavLink to={Room._id} className="content">
                            <h1 className='texth'>{Room.nameRoom}</h1>
                            <div className='imageRoom'>
                                <img src={Room.imageRoom} alt={Room.imageRoom} />
                            </div>
                        </NavLink>
                        
                    </div>
                )
            }
               <h1>You can add room from smarthome app</h1>
        </div>
    )
}
