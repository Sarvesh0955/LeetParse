import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setCurrentUrl(url);
      setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
    });
  }, []);

  const handleParseProblem = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "parseProblem" });
    });
  };

  return (
    <div className="App">
      <h1>LeetCode Parser</h1>
      <button 
        onClick={handleParseProblem} 
        disabled={!isLeetCodeProblem}
        className={isLeetCodeProblem ? 'button-enabled' : 'button-disabled'}
      >
        Parse Problem
      </button>
      {!isLeetCodeProblem && (
        <p className="warning-text">
          Please navigate to a LeetCode problem page (https://leetcode.com/problems/*)
        </p>
      )}
    </div>
  )
}

export default App
