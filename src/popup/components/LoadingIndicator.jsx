import { Box, Fade } from '@mui/material';

/**
 * Component to display a loading indicator
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Whether the component is in loading state
 * @param {ReactNode} props.children - Child components to display during loading
 * @returns {JSX.Element}
 */
const LoadingIndicator = ({ loading, children }) => {
  return (
    <Fade in={loading}>
      <Box sx={{ 
        display: loading ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        my: 2
      }}>
        {children}
      </Box>
    </Fade>
  );
};

export default LoadingIndicator;
