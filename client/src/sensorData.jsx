import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FetchData from './fetchData';

// const ENDPOINT = 'http://localhost:4000';
const ENDPOINT = 'https://chartap.com/data';

const SensorData = () => {
 
 const [buttons, setButtons] = useState([]); 
 const [sensorId, setSensorId] = useState(1001);

  const fetchButtons = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/button`);
      console.log(response.data)
      const sensorIds = response.data.map(item => item.buttonID);
      setButtons(sensorIds);
    } catch (error) {
      console.error('Error fetching buttons:', error);
    }
  };

  useEffect(() => {
    fetchButtons();
  }, []);

  const handleAddButtonClick = async() => {
    const newId = buttons.length > 0 ? Math.max(...buttons) + 1 : 1001; 
    try {
      await axios.post(`${ENDPOINT}/button/`, { id: newId });
      setButtons([...buttons, newId]);
    } catch (error) {
      console.error('Error adding new sensor button:', error);
    }
  };

  const handleButtonClick = (id) => {
    setSensorId(id);
  };
 
  return (
    <>
    <div className='mt-8 px-5 ' >
      
      <div className=' overflow-x-auto flex gap-1 '  >
        {buttons.map(id => (
          <button  type='button'className='button_blue ' key={id} onClick={() => handleButtonClick(id)}>Sensor {id}</button>
        ))}
        <button type='button' className='button_green' onClick={handleAddButtonClick}>Add Sensor Button</button>
      </div>
     

    </div>
    <FetchData sensorId={sensorId}/>
    </>
  );
};

export default SensorData;
