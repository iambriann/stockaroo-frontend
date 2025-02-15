import React, { useEffect, useState } from 'react';
import { formatDateToSydney } from "./utils/dateUtils"; // Import the function

const TopItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/latest');
        console.log(response);
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

    fetchItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-bloombergBg min-h-screen text-bloombergText">
      <h1 className="text-2xl font-bold mb-4 text-bloombergAccent">Stockaroo</h1>
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
