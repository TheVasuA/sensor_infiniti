import React,{useState,useEffect} from 'react'
import axios from 'axios';

const ENDPOINT = 'http://localhost:4000';
// const ENDPOINT = 'https://chartap.com';

const FetchData = ({ sensorId }) => {

    const [data, setData] = useState([]);
  

  const fetchData = async (sensorId) => {
    try {
      const response = await axios.get(`${ENDPOINT}/api/${sensorId}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (sensorId !== null) {
      fetchData(sensorId);
      const intervalId = setInterval(() => fetchData(sensorId), 1000); 
      return () => clearInterval(intervalId);
    }
  }, [sensorId]);


 const companyName= data?.[0]?.COMPANY || "New Company Not Found"
  return (
    <div>      
    <h1 className='companyName'>{`Data of ${companyName}`}</h1>

    <div className="overflow-x-auto px-8">
      <table className="min-w-full bg-white border border-gray-200 ">
        <thead className='bg-gray-200'>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Voltage R</th>
            <th className="py-2 px-4 border-b">Voltage Y</th>
            <th className="py-2 px-4 border-b">Voltage B</th>
            <th className="py-2 px-4 border-b">Current R</th>
            <th className="py-2 px-4 border-b">Current Y</th>
            <th className="py-2 px-4 border-b">Current B</th>
            <th className="py-2 px-4 border-b">Motor Status</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((sensor, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{new Date(sensor.timestamp).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{new Date(sensor.timestamp).toLocaleTimeString()}</td>
              <td className="py-2 px-4 border-b">{sensor.volt_R}</td>
              <td className="py-2 px-4 border-b">{sensor.volt_Y}</td>
              <td className="py-2 px-4 border-b">{sensor.volt_B}</td>
              <td className="py-2 px-4 border-b">{sensor.Cur_R}</td>
              <td className="py-2 px-4 border-b">{sensor.Cur_Y}</td>
              <td className="py-2 px-4 border-b">{sensor.Cur_B}</td>
              <td className="py-2 px-4 border-b">{sensor.motor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
  )
}

export default FetchData