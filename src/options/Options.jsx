import { useState, useEffect } from 'react'
import './Options.css'

function Options() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  // Load saved API key on component mount
  useEffect(() => {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      if (result.geminiApiKey) {
        setApiKey(result.geminiApiKey);
      }
    });
  }, []);

  // Save API key to Chrome storage
  const handleSave = () => {
    chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
      setStatus('API key saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    });
  };

  return (
    <div className="options-container">
      <h1>LeetCode Parser Options</h1>
      
      <div className="form-group">
        <label htmlFor="apiKey">Gemini API Key</label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
        />
        <button onClick={handleSave}>Save</button>
      </div>
      
      {status && <div className="status-message">{status}</div>}
      
      <div className="instructions">
        <h2>Instructions</h2>
        <p>To use this extension, you need to provide your Gemini API key.</p>
        <ol>
          <li>Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
          <li>Enter the API key in the field above</li>
          <li>Click Save</li>
        </ol>
      </div>
    </div>
  )
}

export default Options
