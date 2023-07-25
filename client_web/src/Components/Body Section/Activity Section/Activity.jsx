
import iro from '@jaames/iro';
import './Activity.css'
import React, { useEffect, useState, useContext, Component, useReducer } from "react";
import { BsArrowRightShort, BsDatabase } from 'react-icons/bs'
import socket from '../../../socket/socket';
import imga from '../../../Aseets/abc.jpg'



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
const Activity = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("accessToKen")));
  const [users,usersdispatch]=useReducer(usersReducer,usersinitstate)
  const homeId=JSON.parse(localStorage.getItem("accessToKenHome"));
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

    return (
      <div className='container-listuser'>
        <div className="usermanage flexx">
          <h1>User check</h1>
         
        </div>
        <div className='content-user'>
          {users.loading?<p>loading</p>:
        users.data.map((user) =>
            <div key={user.uid} className="listuser flexx">
              <div className="adminImage">
                <img src={user.imageUser==""?imga:user.imageUser} alt={user.imageUser==""?imga:user.imageUser} />
              </div>
              <div>
                <h3>{user.nameUser}</h3>
                <p>{user.phoneUser}</p>
              </div>
            </div>)
      }
        </div>
      </div>
    )
  
}
export default Activity


