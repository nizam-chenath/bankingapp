import React, {useContext} from 'react';
import './Navbar.css';
import {Link} from "react-router-dom"
import { AuthContext } from '../auth/AuthContext';

function Navbar({loggedIn}) {

  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/" className="navbar-logo">Banking App</a>
      </div>
      <ul className="navbar-links">
       {
        isLoggedIn &&
        <>
        <li><Link to="/deposit">Deposit</Link></li>
        <li><Link to="/withdraw">Withdraw</Link></li>
        <li><Link to="/statement">Account Statement</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </>
       }
       {
        !isLoggedIn &&
        <>
        <li><Link to ="/login">Login</Link></li>
        <li><Link to ="/register">Register</Link></li>
        </>
    

       }
     
       
       
      
     
        
      
      </ul>
    </nav>
  );
}

export default Navbar;
