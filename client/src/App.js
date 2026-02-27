import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/slots')
      .then(response => setSlots(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Affy</h1>
      <ul>
        {slots.map(slot => (
          <li key={slot._id}>{slot.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;