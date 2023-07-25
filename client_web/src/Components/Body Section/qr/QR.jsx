import react, { useContext, useEffect, useState, useReducer } from "react";
import socket from "../../../socket/socket";
import QRCode from 'react-qr-code';
import { AppContext } from "../../../style/context/AppContext";
import "./QR.css"
import { AiOutlineQrcode } from 'react-icons/ai'


const listDeviceinitstate = {
    loading: false,
    data: [],
    error: null
}
const listDeviceRD = (state, action) => {
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

export default function QR() {
    const { isDay,valueADD } = useContext(AppContext);
    const user = JSON.parse(localStorage.getItem("accessToKen"));
    const homeId = JSON.parse(localStorage.getItem("accessToKenHome"));
    const [lists, listDevcedD] = useReducer(listDeviceRD, listDeviceinitstate)
    const [pinEsp, setpinEsp] = useState("");
    useEffect(() => {
        async function lisdevice() {
            listDevcedD({
                type: 'GET_API'
            });
            setTimeout(() => {
                try {
                    socket.emit("getDevicesToHome", { _id: user._id, homeId: homeId })
                    socket.on("getListforHome", list => {
                        listDevcedD({
                            type: 'GET_SUCCESS',
                            data: list,

                        });

                    })

                } catch (errr) {
                    listDevcedD({
                        type: 'GET_ERR'
                    });
                }
            }, 300)

        }
        lisdevice();
    }, [])
    // them 
    // useEffect(() => {
    //     socket.emit("createPin", { nameDevice: "Door Gara", iconName: "door-open", pinEsp: 7 })
    // })
    const [valuea, setValue] = useState();
    const [back, setBack] = useState('#FFFFFF');
    const [fore, setFore] = useState('#000000');
    const [size, setSize] = useState(256);
    function addPin() {
        socket.emit("createPin", { nameDevice: "Door Gara", iconName: "door-open", pinEsp: 7 })
    }

    return (
        <div>
            {/* <button className="btn"><AiOutlineQrcode className="icon" /><span>ADD QR</span></button>
            <div className="QRContainer">
                <select>
                    {valueADD == null ? "" :
                        valueADD.map((device) => (
                            <option value={device}>{device.nameDevice}</option>
                        ))
                    }
                </select >
                {valuea && (
                    <QRCode
                        title="GeeksForGeeks"
                        value={valuea}
                        size={size === '' ? 0 : size}
                    />
                )}
            </div> */}
            <div className="QRContainer flex">
                {valueADD == null ? "" :
                    valueADD.map((device, index) => (
                        <div key={device.pinEsp} className="Qrcheckicon">
                            <div className="cardName flex">
                                <h1>{device.nameDevice}</h1>
                                <p>{"ESPpin" + device.pinEsp}</p>
                            </div>
                            <QRCode
                                title="GeeksForGeeks"
                                value={JSON.stringify(device)}
                                bgColor={isDay ? "#000000" : "#FFFFFF"}
                                fgColor={isDay ? "#FFFFFF" : "#000000"}
                                size={230}
                            />
                        </div>
                    ))
                }
            </div>
        </div>

    )
}