import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

/**
 * Custom hook to manage communication with background script
 */
export const useBackgroundConnection = ({ 
  setParseLoading, 
  setExtractLoading, 
  setTestCase, 
  setCodeSnippet 
}) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const backgroundPort = chrome.runtime.connect({ name: 'popup' });

    const messageListener = (message) => {
      switch (message.action) {
        case 'connectionEstablished':
          break;
          
        case 'codeGenerated':
          setParseLoading(false);
          if (message.error) {
            console.error('Code generation error:', message.error);
            enqueueSnackbar(message.error, { variant: 'error' });
          } else {
            setCodeSnippet(message.codeSnippet || '');
            setTestCase(message.testCase || '');
            enqueueSnackbar('Code generated successfully!', { variant: 'success' });
          }
          break;
          
        case 'otherTestsGenerated':
          setExtractLoading(false);
          if (message.error) {
            console.error('Test case error:', message.error);
            enqueueSnackbar(message.error, { variant: 'error' });
          } else {
            console.log('Test cases generated successfully');
            setTestCase(message.testCase || '');
            enqueueSnackbar('Test cases extracted successfully!', { variant: 'success' });
          }
          break;
          
        default:
          console.log('Unknown message action:', message.action);
      }
    };

    backgroundPort.onMessage.addListener(messageListener);

    const disconnectListener = () => {
      console.log('Popup disconnected from background');
    };

    backgroundPort.onDisconnect.addListener(disconnectListener);

    return () => {
      if (backgroundPort) {
        backgroundPort.onMessage.removeListener(messageListener);
        backgroundPort.onDisconnect.removeListener(disconnectListener);
        backgroundPort.disconnect();
      }
    };
  }, [enqueueSnackbar, setParseLoading, setExtractLoading, setTestCase, setCodeSnippet]);
};

export default useBackgroundConnection;
