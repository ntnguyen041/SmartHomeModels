import React, {useContext } from "react";
import Listing from "../Listing Section/Listing";
import Activity from "../Activity Section/Activity";
import Top from "../Top Section/Top";
import TableSection from "../Table Section/TableSection";
 
const home =()=>{
    return(
      <div>
            <Top/>
            <div className="bottom flex">
                <Listing/>
                <Activity/>
            </div>
            <TableSection/>
        </div>
   
    )
    
}
export default home