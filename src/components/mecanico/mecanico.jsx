import React from 'react';
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import logo from '../../images/logo.jpg'

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
  faHourglass1,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUser,
  faTrash,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faAngleUp,
);

const Mecanico = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log(user);
      alert('Se ha cerrado la sesión');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <h1>hola mecanico </h1>
  )
}

export default Mecanico;