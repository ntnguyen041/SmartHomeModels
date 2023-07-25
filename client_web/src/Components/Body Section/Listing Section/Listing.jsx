import React, { useEffect, useState, useRef, useContext } from "react";
import { Line } from "react-chartjs-2";
import { NavLink, Link, useNavigate } from "react-router-dom";
import './Listing.css'
import Chart from 'chart.js/auto';
import { BsArrowRightShort } from 'react-icons/bs'
import socket from "../../../socket/socket";
import { AppContext } from "../../../style/context/AppContext";



const Listing = () => {
  const so = 20;
  const { listRoom, lists,chart } = useContext(AppContext);
  


  return (
    <div className="LisitingSection ">
      <div className="heading flex">
        <h1>Room Controll</h1>
        <NavLink to="/Room" className={"menuLink flex"}>
          <button className="btn flex">
            See all <BsArrowRightShort className="icon" />
          </button>
        </NavLink>
      </div>
      <div className="secContainer flex">
        {listRoom.loading ? ""
          : listRoom.data.map((Room) =>
            <NavLink to={"Room/" + Room._id} key={Room._id} className="singleItem">
              <img src={Room.imageRoom} alt={Room.imageRoom} />
              <span>{Room.devicesId.length+" Device"}</span>
              <h3>{Room.nameRoom}</h3>
            </NavLink>
          )}
      </div>
      <div className="chart">
        <h1>Temperature chart</h1>
        <Line
          data={{
            labels: lists.loading ? "Loading" : lists.data.map((Device) => Device.nameDevice),
            datasets: [
              {
                data: chart.loading ? "Loading" : chart.map((Device) => Device.countOn),
                label: "Count on",
                borderColor: "#3e95cd",
                fill: false
              },
              {
                data: chart.loading ? "Loading" : chart.map((Device) => Device.consumes),
                label: "Consume",
                borderColor: "#FFD700",
                fill: false
              },
            ]
          }}
        />
      </div>
    </div>
  )
}
export default Listing