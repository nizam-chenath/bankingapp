import React, {useContext} from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function Logout({setLoggedIn}) {
  

  const { login, logout } = useContext(AuthContext);
  const Navigate = useNavigate()

  const handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (response.ok) {
          logout()
          localStorage.removeItem('token');
          // Redirect the user to the login page
          console.log("logout successful")
          Navigate("/login")
          
          
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
