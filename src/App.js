import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const App = () => {
  const [counter, SetCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleReload = () => {
    alert('Reloading');
    window.location.reload();
  };

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'panthativishnu226@gmail.com',
          subject: 'Test Email from React App',
          text: 'Hello! This email was sent from my React app via Node.js backend.',
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert(`Failed to send email: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendServerInfoEmail = async () => {
    setLoading(true);
    console.log('Attempting to send server info email...'); // Debug log
    
    try {
      const res = await fetch('http://localhost:5000/send-server-info-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'panthativishnu226@gmail.com',
        }),
      });

      console.log('Response status:', res.status); // Debug log
      
      const result = await res.json();
      console.log('Response data:', result); // Debug log

      if (res.ok) {
        alert('Server info email sent successfully!');
      } else {
        alert(`Failed to send server info email: ${result.error || 'Unknown error'}`);
        console.error('Server error:', result);
      }
    } catch (error) {
      console.error('Error sending server info email:', error);
      alert('Something went wrong: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test server connection
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      console.log('Server health check:', data);
      alert('Server is reachable: ' + data.status);
    } catch (error) {
      console.error('Server connection test failed:', error);
      alert('Cannot reach server: ' + error.message);
    }
  };

  return (
    <div className='App'>
      <button onClick={() => SetCounter((prevCount) => prevCount - 1)}>-</button>
      <h1>{counter}</h1>
      <button onClick={() => SetCounter((prevCount) => prevCount + 1)}>+</button>
      <br />
      <button onClick={handleReload}>Click here to Reload</button>
      <br />
      <button onClick={handleSendEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Email'}
      </button>
      <br />
      <button onClick={sendServerInfoEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Server Info Email'}
      </button>
      <br />
      <button onClick={testConnection}>Test Server Connection</button>
    </div>
  );
};

export default App;