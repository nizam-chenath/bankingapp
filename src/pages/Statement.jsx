import React, { useEffect, useState } from 'react';

function Statement() {
  const [statement, setStatement] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/statement', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => setStatement(data.statement))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className='statement-table-section'>
      <h1>Account Statement</h1>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {statement.map(({ amount, type, date }) => (
            <tr key={date}>
              <td>{amount}</td>
              <td>{type}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Statement;
