import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [cfInput, setCfInput] = useState('');
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setCurrentUrl(url);
      setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "codeGenerated") {
        setLoading(false);
        
        if (message.error) {
          setError(message.error);
        } else {
          setBoilerplateCode(message.boilerplateCode || '');
          setCfInput(message.testCase || '');
          setError('');
        }
      }
    });
  }, []);

  const handleParseProblem = () => {
    setLoading(true);
    setError('');
    setCfInput('');
    setBoilerplateCode('');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "parseProblem" });
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="App">
      <h1>LeetCode Parser</h1>
      <button 
        onClick={handleParseProblem} 
        disabled={!isLeetCodeProblem || loading}
        className={isLeetCodeProblem && !loading ? 'button-enabled' : 'button-disabled'}
      >
        {loading ? 'Parsing...' : 'Parse Problem'}
      </button>
      
      {!isLeetCodeProblem && (
        <p className="warning-text">
          Please navigate to a LeetCode problem page (https://leetcode.com/problems/*)
        </p>
      )}
      
      {error && (
        <div className="error-container">
          <p className="error-text">Error: {error}</p>
        </div>
      )}
      
      {cfInput && (
        <div className="result-container">
          <h2>Input</h2>
          <pre className="code-block">{cfInput}</pre>
          <button 
            className="copy-button"
            onClick={() => copyToClipboard(cfInput)}
          >
            Copy Input
          </button>
        </div>
      )}
      
      {boilerplateCode && (
        <div className="result-container">
          <h2>Boilerplate Code</h2>
          <pre className="code-block">{boilerplateCode}</pre>
          <button 
            className="copy-button"
            onClick={() => copyToClipboard(boilerplateCode)}
          >
            Copy Code
          </button>
        </div>
      )}
    </div>
  )
}

export default App
