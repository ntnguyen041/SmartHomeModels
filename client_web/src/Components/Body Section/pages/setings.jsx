import React, { useEffect, useState, } from "react";
import TopUser from "../Top Section/TopUser";

const seting =()=>{
    return(
        <div>
           <TopUser/>  
           <div>
           <table>
        <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
        </tr>
        <tr>
            <td>Anom</td>
            <td>19</td>
            <td>Male</td>
        </tr>
        <tr>
            <td>Megha</td>
            <td>19</td>
            <td>Female</td>
        </tr>
        <tr>
            <td>Subham</td>
            <td>25</td>
            <td>Male</td>
        </tr>
    </table>
           </div>
      </div>
    )
    
}
export default seting