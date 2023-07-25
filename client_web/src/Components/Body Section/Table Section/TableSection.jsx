import React, { useContext } from 'react'
import MUIDataTable from "mui-datatables";
import "./TableSection.css"
import {useReducer,useEffect} from "react"
import socket from '../../../socket/socket';
import { AppContext } from '../../../style/context/AppContext';

const columns = ["roomName","nameDevice", "pinEsp", "status","consumes","countOn","timeOn","timeOff","dayRunning"];

const options = {
  filterType: 'checkbox',
};

export default function TableSection() {
  const {lists,chart} =useContext(AppContext)
  return (
    <div className='tablesection'>
      {lists.loading?"":
      <MUIDataTable
                        title={"Device Data Show table"}
                        data={chart}
                        columns={columns}
                        options={options}
                    />
      }
    </div>
  )
}
