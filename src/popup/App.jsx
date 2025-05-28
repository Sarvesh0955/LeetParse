import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [cfInput, setCfInput] = useState('');
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('leetcode-parser-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [copyBadges, setCopyBadges] = useState({
    input: false,
    code: false
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('leetcode-parser-theme', theme);
  }, [theme]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setCurrentUrl(url);
      setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
    });

    const port = chrome.runtime.connect({ name: 'popup' });
    
    const messageListener = (message) => {
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
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      if (port) {
        port.disconnect();
      }
    };
  }, []);

  const handleParseProblem = () => {
    setLoading(true);
    setError('');
    setCfInput('');
    setBoilerplateCode('');
    setConnectionAttempted(true);
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id) {
        setLoading(false);
        setError('Cannot access the current tab');
        return;
      }
      
      const timeoutId = setTimeout(() => {
        if (loading && connectionAttempted) {
          setLoading(false);
          setError('Content script not responding. Make sure you are on a LeetCode problem page and try refreshing.');
        }
      }, 5000);
      
      chrome.tabs.sendMessage(tabs[0].id, { action: "parseProblem" }, (response) => {
        clearTimeout(timeoutId);
        
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
          setLoading(false);
          setError('Content script not accessible. Make sure you are on a LeetCode problem page.');
        } else {
          console.log("Message acknowledged by content script:", response);
        }
      });
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        setCopyBadges(prev => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setCopyBadges(prev => ({ ...prev, [type]: false }));
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        setError('Failed to copy to clipboard');
      });
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <button onClick={toggleTheme} className="theme-switch" title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
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
      
      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Parsing problem, please wait...</p>
        </div>
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
            onClick={() => copyToClipboard(cfInput, 'input')}
          >
            Copy Input
            <span className={`badge ${copyBadges.input ? 'visible' : ''}`}>Copied!</span>
          </button>
        </div>
      )}
      
      {boilerplateCode && (
        <div className="result-container">
          <h2>Boilerplate Code</h2>
          <pre className="code-block">{boilerplateCode}</pre>
          <button 
            className="copy-button"
            onClick={() => copyToClipboard(boilerplateCode, 'code')}
          >
            Copy Code
            <span className={`badge ${copyBadges.code ? 'visible' : ''}`}>Copied!</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default App
