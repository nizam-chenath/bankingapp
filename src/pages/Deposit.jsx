import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Deposit() {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:5000/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ amount }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .then(() => navigate("/statement"))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cash Deposit</h1>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Deposit;
