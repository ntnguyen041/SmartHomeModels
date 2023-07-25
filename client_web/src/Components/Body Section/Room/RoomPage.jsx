import React from 'react'
import TopUser from '../Top Section/TopUser'
import { NavLink, json, useLocation, } from 'react-router-dom'
import { useReducer, useEffect, useState } from 'react'
import socket from '../../../socket/socket'
import MUIDataTable from "mui-datatables";
import "./RoomPage.css"
const columns = ["nameDevice", "pinEsp", "status","consumes","countOn","timeOn","timeOff","dayRunning","dayRunningStatus"];

const options = {
    filterType: 'checkbox',
};
const listDeviceinitstate = {
    loading: false,
    data: [],
    error: null
}
const listDeviceReducer = (state, action) => {
    switch (action.type) {
        case 'GET_API':
            return {
                ...state,
                loading: true
            }
        case 'GET_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.data,

            }
        case 'GET_ERR':
            return {
                ...state,
                data: [],

                error: action.data
            }
        default:
    }
}
export default function RoomPage() {
    const [user] = useState(JSON.parse(localStorage.getItem("accessToKen")));
    const Roomid = useLocation();
    const [listDevce, listDevcedispatch] = useReducer(listDeviceReducer, listDeviceinitstate)

    useEffect(() => {
        async function lisdevice() {
            listDevcedispatch({
                type: 'GET_API'
            });
            setTimeout(() => {
                try {
                    socket.emit("getDevices", { _id: user._id, roomId: Roomid.pathname.slice(6) })
                    socket.on("listDevices", list => {
                        listDevcedispatch({
                            type: 'GET_SUCCESS',
                            data: list,
                        });
                    })
                } catch (errr) {
                    listDevcedispatch({
                        type: 'GET_ERR'
                    });
                }
            }, 300)

        }
        lisdevice();
    }, [])
    return (
        <div>
            <TopUser />
            <div className='containerRoom'>
                <div className="singleItem flex">
                    {listDevce.loading?"":
                    <NavLink to="/Room" className="content">
                        <h1 className='texth'>{listDevce.data.nameRoom}</h1>
                        <div className='imageRoom'>
                            <img src={listDevce.data.imageRoom} alt={listDevce.data.imageRoom} />
                        </div>
                    </NavLink>
                    }
                   
                </div>
                <div className='Tabledevice'>
                {listDevce.loading?"":
                    <MUIDataTable
                        title={listDevce.data.nameRoom}
                        data={listDevce.data.devicesId}
                        columns={columns}
                        options={options}
                    />
                }
                </div>
            </div>

        </div>
    )
}
