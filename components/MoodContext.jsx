// MoodContext.js
import React, { createContext, useState } from 'react';

export const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [mood, setMood] = useState(0); // Default mood value
  const [moodHistory, setMoodHistory] = useState([]); // Store mood history

  const addMood = (newMood) => {
    setMood(newMood);
    setMoodHistory((prev) => [...prev, newMood]); // Append new mood to history
  };

  return (
    <MoodContext.Provider value={{ mood, setMood, moodHistory, addMood }}>
      {children}
    </MoodContext.Provider>
  );
};