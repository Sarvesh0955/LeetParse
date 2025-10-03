/**
 * Message type constants for extension communication
 * Centralizes all message types used between popup, content, and background scripts
 */

// Content script to background messages
export const PARSE_REQUEST = 'parseProblem';
export const EXTRACT_TESTS_REQUEST = 'otherTests';
export const PARSE_RESULT = 'processCode';
export const TESTS_RESULT = 'parsedTests';
export const PARSE_ERROR = 'parseError';

// Background to popup messages
export const CODE_GENERATED = 'codeGenerated';
export const TESTS_GENERATED = 'otherTestsGenerated';
export const CONNECTION_ESTABLISHED = 'connectionEstablished';

// Message action types
export const MESSAGE_TYPES = {
  // Content -> Background
  PARSE_REQUEST,
  EXTRACT_TESTS_REQUEST,
  PARSE_RESULT,
  TESTS_RESULT,
  PARSE_ERROR,
  
  // Background -> Popup
  CODE_GENERATED,
  TESTS_GENERATED,
  CONNECTION_ESTABLISHED,
};

export default MESSAGE_TYPES;
