import React, { useEffect, useState } from 'react';
import { formatDateToSydney } from "./utils/dateUtils"; // Import the function

const TopItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items from the API
  const fetchItems = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      console.error(API_URL);
      const response = await fetch("http://43.229.62.179:8080/latest");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(); // Initial fetch

    // Set interval to refresh data every 60 seconds
    const interval = setInterval(() => {
      // Get the current time in Sydney
      const sydneyTime = new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" });
      const currentTime = new Date(sydneyTime);
      // Get the hour and minute
      const hour = currentTime.getHours();
      const minute = currentTime.getMinutes();      
      // Check if current time is between 6:30 AM and 7:00 PM
      if ((hour > 6 || (hour === 6 && minute >= 30)) && (hour < 19 || (hour === 19 && minute === 0))) {
        fetchItems();
      } else {
        console.log("Fetch request is outside of the allowed time range.");
      }
    }, 20000); // 20 second refresh

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-bloombergBg min-h-screen text-bloombergText">
      <h1 className="text-2xl font-bold mb-4 text-bloombergAccent">ASXPulse - Rapid access to fresh news</h1>
      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: '12%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '30%' }} />
          <col style={{ width: '50%' }} />
        </colgroup>        
        <thead>
          <tr className="bg-bloombergTable text-bloombergAccent">
            <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Source</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-800">
              <td className="border border-gray-300 px-4 py-2 text-left">{formatDateToSydney(item.detectedTimestamp)}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{item.source}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{item.title}</td>
              <td className="border border-gray-300 px-4 py-2 text-left">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default TopItems;
