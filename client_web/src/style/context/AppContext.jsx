import {createContext, useState,useEffect, useReducer} from "react";
import socket from "../../socket/socket";
export const AppContext =createContext();


const listhomeinitstate = {
    loading: false,
    data: [],
    error: null
}
const listhomeReduduces = (state, action) => {
    switch (action.type) {
        case 'GET':
            return {
                ...state,
                loading: true
            }
        case 'OK':
            return {
                ...state,
                loading: false,
                data: action.data,
            }
        case 'ER':
            return {
                ...state,
                data: [],
                error: action.data
            }
        default:
    }
}


const usersinitstate={
    loading:false,
    data:[],
    error:null
  }
  const usersReducer=(state,action)=>{
    switch(action.type){
      case 'GET_SOCKET_API':
        return{
          ...state,
          loading:true
        }
      case 'GET_SOCKET_SUCCESS':
        return{
          ...state,
          loading:false,
          data:action.data
        }
      case 'GET_SOCKET_ERR':
        return{
          ...state,
          data:[],
          error:action.data
        }
      default:
    }
  }

  const listRoominitstate = {
    loading: false,
    data: [],
    error: null
}


const listRoomReducer = (state, action) => {
    switch (action.type) {
        case 'GET_ROOM_API':
            return {
                ...state,
                loading: true
            }
        case 'GET_ROOM_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.data
            }
        case 'GET_ROOM_ERR':
            return {
                ...state,
                data: [],
                error: action.data
            }
        default:
    }
}
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




  
export const AppProvider = ({children})=>{
    const [user,setUserlogin]=useState(JSON.parse(localStorage.getItem("accessToKen")));
    const [listhome, listhomedispatch] = useReducer(listhomeReduduces, listhomeinitstate);
    
    
    const [users,usersdispatch]=useReducer(usersReducer,usersinitstate)
    const [homeId,sethomeid]=useState(JSON.parse(localStorage.getItem("accessToKenHome")));
    const [listRoom, listRoomdispatch] = useReducer(listRoomReducer, listRoominitstate)
    const [lists, listDevcedD] = useReducer(listDeviceRD, listDeviceinitstate)
    const valueADD = [
        {
            homeId:homeId,nameDevice: "Light", iconName: "lightbulb", pinEsp: 2
        },
        {
            homeId:homeId,nameDevice: "Light", iconName: "lightbulb", pinEsp: 3
        },
        {
            homeId:homeId,nameDevice: "Light", iconName: "lightbulb", pinEsp: 12
        },
        {
            homeId:homeId,nameDevice: "Fence Gate", iconName: "door-open", pinEsp: 8
        },
        {
            homeId:homeId,nameDevice: "Door Gara", iconName: "door-open", pinEsp: 7
        },
        {
            homeId:homeId,nameDevice: "Main Door", iconName: "door-open", pinEsp: 4
        },
        {
            homeId:homeId,nameDevice: "Fan", iconName: "fan", pinEsp: 15
        }
    ]
 
 
    const [isDay,setIsDay]=useState(false);
    const themeStyle ={
        light:'light',
        night:'night'
    }
    ////chart
    const [chart,setchart]=useState([])

    useEffect(() => {
        if(user!==null){
            const id = user._id;
            socket.emit("joinRoom",  user._id);
        }
    }, [user]);
 




    useEffect(() => {
        async function loadname() {
            listhomedispatch({
                type: 'GET'
            });
            setTimeout(() => {
                try {
                    socket.emit("getHomeUser", { _id: user._id, homeId: user.homeId })
                    socket.on("listHomeUser", list => {
                        listhomedispatch({
                            type: 'OK',
                            data: list,
                        });
                    })
                } catch (error) {
                    listhomedispatch({
                        type: 'ER'
                    });
                }
            }, 300);
            

        }
        loadname();
    }, [])

    useEffect(() => {
        async function loaduserRom() {
          setTimeout(()=>{
            try {
              // lay toan bo user
              socket.emit("getAllUser", { uid: user.uid, homeId: homeId });
              socket.on('listUserView', (users) => {
                usersdispatch({
                  type:'GET_SOCKET_SUCCESS',
                  data:users
                });
              })
            } catch (error) {
              usersdispatch({
                type:'GET_SOCKET_ERR',
              });
            }
          },100)
          usersdispatch({
            type:'GET_SOCKET_API'
          });
        }
        loaduserRom();
      },[homeId]);

    
      useEffect(() => {
        if(homeId!==null){

            async function lisromm() {
                listRoomdispatch({
                    type: 'GET_ROOM_API'
                });
                try {
                    socket.emit("getitemhome", homeId)
                    socket.on("listRoom", list => {
                        listRoomdispatch({
                            type: 'GET_ROOM_SUCCESS',
                            data: list
                        });
                    })
                } catch (errr) {
                    listRoomdispatch({
                        type: 'GET_ROOM_ERR'
                    });
                }
            }
            lisromm();
        }
      }, [homeId])

 
      useEffect(() => {
        async function lisdevice() {
          listDevcedD({
                type: 'GET_API'
            });
            setTimeout(() => {
                try {
                    socket.emit("getDevicesToHome", { _id: user._id, homeId: JSON.parse(localStorage.getItem("accessToKenHome"))})
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
    }, [homeId])


  useEffect(() => {
    setInterval(() => {
            try {
                socket.emit("getDevicesToHome", { _id: user._id, homeId: JSON.parse(localStorage.getItem("accessToKenHome"))})
                socket.on("getListforHome", list => {
                    setchart(list)
                })
            } catch (errr) {
               
            }

    }, 2000);
}, [homeId])

    return (
        <AppContext.Provider value={{
            isDay,
            setIsDay,
            themeStyle:themeStyle[isDay?'night':'light'],
            user,
            listhome:listhome,
            sethomeid,
            homeId,
            listRoom,
            lists,
            valueADD,
            setUserlogin,
            chart
            }}>
        {children}
        </AppContext.Provider>
    )
};