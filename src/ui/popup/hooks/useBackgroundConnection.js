import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { CONNECTION_ESTABLISHED, CODE_GENERATED, TESTS_GENERATED, VSCODE_EXPORT_ERROR, VSCODE_EXPORT_SUCCESS } from '../../../messaging/messages.js';

/**
 * Custom hook to manage communication with background script
 */
export const useBackgroundConnection = ({ 
  setParseLoading, 
  setExtractLoading, 
  setTestCase, 
  setCodeSnippet,
  setSampleOutputs
}) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const backgroundPort = chrome.runtime.connect({ name: 'popup' });

    const messageListener = (message) => {
      switch (message.action) {
        case CONNECTION_ESTABLISHED:
          break;
          
        case CODE_GENERATED:
          setParseLoading(false);
          if (message.error) {
            console.error('Code generation error:', message.error);
            enqueueSnackbar(message.error, { variant: 'error' });
          } else {
            setCodeSnippet(message.codeSnippet || '');
            setTestCase(message.testCase || '');
            setSampleOutputs(message.sampleOutputs || []);
            enqueueSnackbar('Code generated successfully!', { variant: 'success' });
          }
          break;
          
        case TESTS_GENERATED:
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
        case VSCODE_EXPORT_SUCCESS:
          enqueueSnackbar(message.message || 'Problem exported to CPH successfully!', { variant: 'success' });
          break;
        case VSCODE_EXPORT_ERROR:
          if (message.fallback && message.copyText) {
            navigator.clipboard.writeText(message.copyText)
              .then(() => enqueueSnackbar(message.message || 'Problem data copied to clipboard for manual import.', { variant: 'warning' }))
              .catch((err) => {
                console.error('Clipboard write failed:', err);
                enqueueSnackbar('CPH not detected and failed to copy data. Open console for details.', { variant: 'error' });
              });
          } else {
            enqueueSnackbar(message.message || 'Failed to export to CPH', { variant: 'error' });
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
  }, [enqueueSnackbar, setParseLoading, setExtractLoading, setTestCase, setCodeSnippet, setSampleOutputs]);
};

export default useBackgroundConnection;
