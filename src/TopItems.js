import React, { useEffect, useState } from 'react';

const TopItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/latest');
        console.log("hello");
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Top 10 Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id} className="mb-1">
            {item.title} (Description: {item.desc})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopItems;
