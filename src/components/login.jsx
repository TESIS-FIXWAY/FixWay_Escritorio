import React, { useState } from "react";
import '../styles/login.css';

import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { singIn } = UserAuth();
  const navigate = useNavigate();

  const handleSumit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await singIn(email, password);
      navigate('/admin');
      alert('bienvenido');
    } catch (e) {
      setError(e.message);
      alert('Correo o contraseña incorrecta')
      console.log(e.message);
      console.log(error);
    }
  }
  
  return (
    <div className="container-form login">
        <div className="informacion">
            <div className="info">
                <h2>Bienvenido</h2>
                <p>taller mecanico Hans Motors</p>
            </div>
        </div>
        <div className="form-informacion">
            <div className="form-info-childs">
                <h2>Iniciar sesion</h2>
                <form className="formulario" onSubmit={handleSumit}>
                    <label>
                        <i className='bx bx-envelope' ></i>
                        <input 
                            type="email" 
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            />
                    </label>
                    <label>
                        <i className='bx bx-lock-alt'></i>                        
                        <input
                            type="password" 
                            placeholder="contrasena"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                    </label>
                    <input 
                      type="submit" 
                      value="Iniciar sesion"
                      />
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;