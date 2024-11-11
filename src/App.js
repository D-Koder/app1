// App.js
import React, { useState } from 'react';
import './App.css';
import ChatComponent from './chat';

function App() {
  const [task, setTask] = useState('');
  const [sessionDuration, setSessionDuration] = useState('25');

  // Handle the start focus session button click
  const handleStartSession = () => {
  };

  return (
    <div className="container">
      <header className="header">
        <h1>FocusMate</h1>
        <p className="tagline">Maximize your focus. Minimize distractions.</p>
      </header>

      <main className="content">
        <form className="focus-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="task">What are you focusing on today?</label>
          <input
            type="text"
            id="task"
            name="task"
            placeholder="e.g., Study for math exam"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />

          <label htmlFor="session-duration">Select Focus Session Duration:</label>
          <select
            id="session-duration"
            name="session-duration"
            value={sessionDuration}
            onChange={(e) => setSessionDuration(e.target.value)}
          >
            <option value="25">25 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>

          <button type="button" onClick={handleStartSession}>
            Start Focus Session
          </button>
        </form>

        {/* ChatComponent renders the Generated Study Plan */}
        <ChatComponent task={task} time={sessionDuration} />
      </main>
    </div>
  );
}

export default App;
