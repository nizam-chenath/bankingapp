import './App.css';
import Deposit from './pages/Deposit';
import Login from './pages/Login';
import Register from './pages/Register';
import {Routes, Route, Navigate} from "react-router-dom"
import Withdraw from './pages/withdraw';
import Statement from './pages/Statement';
import Logout from './pages/Logout';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import { AuthProvider } from './auth/AuthContext';
import Home from './pages/Home';



function App() {

  
  return (
    <div className="App">
   
    
    <AuthProvider>
    <Navbar />
     <Routes>
     <Route path="/" element={<Login  />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/withdraw" element={<Withdraw />} />
      <Route path="/statement" element={<Statement />} />
     
      <Route path="/register" element={<Register />} />
    <Route path="/logout" element={<Logout />} /> 
    <Route path="/login" element={<Login/>} /> 
  
    </Routes>
    </AuthProvider>
   
    
  
    </div>
  );
}

export default App;
