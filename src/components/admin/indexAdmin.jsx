// src/index.jsx
import './indexAdmin.css'
import React, { useState } from "react";
import Admin from "./admin";

import { db } from "../../firebase";
import { collection, getDocs, onSnapshot, query, addDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import { deleteDoc } from 'firebase/firestore';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';



import { 
  faUser,
  faTrash,
  faUsers,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faAngleUp,
  faList,
  faHouse,
  faChevronDown,
  faUserPlus,
  faArrowRightFromBracket,
  faBars,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUser,
  faTrash,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faHouse,
  faChevronDown,
  faFileInvoice,
  faUserPlus,
  faUsers,
  faArrowRightFromBracket,
  faBars,

  faBars,
  faArrowLeft
);


const IndexAdmin = () => {
  return (

    <>
    <Admin />
    
        <div className='card_admin'>
        <div className='card_landing'>
            <h1>usuarios</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users" />
            <hr className='hr-container'/>
            <p>gestiona a los usuarios del taller</p>
        </div>
        <div className='card_info'></div>

        <div className='card_landing'>
            <h1>usuarios</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users" />
            <hr  className='hr-container'/>
            <p>gestiona a los usuarios del taller</p>
        </div>
        <div className='card_info'></div>
        <div className='card_landing'>
            <h1>usuarios</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users" />
            <hr className='hr-container'/>
            <p>gestiona a los usuarios del taller</p>
        </div>
        <div className='card_info'></div>
        </div>

    </>

  );
};

export default IndexAdmin;