import React, { useEffect, useState, useRef  } from 'react';
import { formatDateToSydney } from "./utils/dateUtils"; // Import the function

const TopItems = () => {
  const [items, setItems] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true); // Track sound state
  const prevLastItemRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const playSound = () => {
    const audio = new Audio("/notification.mp3"); 
    audio.play();
  };

  const getSydneyTime = () => {
    const sydneyTime = new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney", hour12: true });
    return new Date(sydneyTime).toLocaleString("en-US", {
      weekday: "short", // Optional: e.g., "Mon"
      year: "numeric",
      month: "short", // Optional: e.g., "Mar"
      day: "numeric",
      hour: "2-digit", // Ensures two-digit hour
      minute: "2-digit", // Ensures two-digit minute
      second: "2-digit", // Ensures two-digit second
      hour12: true // Show AM/PM
    });
  };


  // Fetch items from the API
  const fetchItems = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };      
      const response = await fetch(API_URL, requestOptions);
      console.log("API Response:", response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLastUpdated(getSydneyTime());
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
  });

  useEffect(() => {
    const lastItem = items[items.length - 1];
    if (lastItem && lastItem !== prevLastItemRef.current && soundEnabled) {
      playSound();
    }
    prevLastItemRef.current = lastItem;
  }, [items, soundEnabled]);

  if (loading) {
    return <p>Loading...</p>;
  }


  const handleClick = () => {
    // Toggle the soundEnabled state
    setSoundEnabled((prev) => {
      const newState = !prev;
      
      // If sound is enabled, play the sound
      if (newState) {
        playSound()
      }

      return newState;
    });
  };

  return (
    <div className="container">
      <h1 className="header-title">ASXPulse - Rapid access to fresh news</h1>
      <div className="last-updated">
        Last Updated: {lastUpdated}
      </div>
      <button onClick={handleClick} className="sound-button">
        {soundEnabled ? "🔊 Sound notifications for new headlines ON" : "🔇 Sound notifications for new headlines OFF"}
      </button>
      <div className="row header-row">
        <div className="column time">Time</div>
        <div className="column source">Source</div>
        <div className="column title">Title</div>
        <div className="column description">Description</div>
      </div>
      {items.map((item) => (
        <div className="row">
          <div className="column time">{formatDateToSydney(item.detectedTimestamp)}</div>
          <div className="column source">{item.source}</div>
          <div className="column title">{item.title}</div>
          <div className="column description">{item.desc}</div>
        </div>
      ))}
    </div>
  );
  
};

export default TopItems;
