/**
 * Message router/dispatcher for background script
 * Routes incoming messages to appropriate handlers
 */

/**
 * Creates a message router that dispatches messages to registered handlers
 * @param {Object} handlers - Map of message action types to handler functions
 * @returns {Function} Message listener function
 */
export function createMessageRouter(handlers) {
  return async (message, sender, sendResponse) => {
    try {
      // Send immediate acknowledgment
      sendResponse({ received: true });
      
      if (!message || !message.action) {
        console.error('Invalid message received:', message);
        return true;
      }
      
      const handler = handlers[message.action];
      
      if (handler && typeof handler === 'function') {
        await handler(message, sender);
      } else {
        console.warn('No handler found for action:', message.action);
      }
      
      return true;
    } catch (error) {
      console.error('Error in message router:', error);
      return true;
    }
  };
}

/**
 * Helper to send message to specific popup or all active popups
 * @param {Object} activePopupPorts - Map of tabId to port connections
 * @param {Object} message - Message to send
 * @param {number|null} tabId - Optional specific tab ID
 */
export function sendToPopup(activePopupPorts, message, tabId = null) {
  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`Attempting to send message to ${tabId ? `tab ${tabId}` : 'all tabs'}:`, message);
  }
  
  const sendMessageToPort = (id, port) => {
    try {
      port.postMessage(message);
    } catch (error) {
      console.error(`Error sending to popup on tab ${id}:`, error);
      delete activePopupPorts[id];
    }
  };
  
  if (tabId && activePopupPorts[tabId]) {
    sendMessageToPort(tabId, activePopupPorts[tabId]);
  } else if (tabId && !activePopupPorts[tabId]) {
    console.warn(`No active popup found for tab ${tabId}.`);
  } else {
    const activeTabIds = Object.keys(activePopupPorts);
    activeTabIds.forEach(id => sendMessageToPort(id, activePopupPorts[id]));
  }
}
