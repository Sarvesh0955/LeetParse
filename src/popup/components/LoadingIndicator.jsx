import { Box, Fade, CircularProgress, Typography } from '@mui/material';

/**
 * Component to display a loading indicator
 * 
 * @param {Object} props
 * @param {boolean} props.loading - Whether the component is in loading state
 * @returns {JSX.Element}
 */
const LoadingIndicator = ({ loading }) => {
  return (
    <Fade in={loading}>
      <Box sx={{ 
        display: loading ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        my: 2
      }}>
        <CircularProgress size={32} />
        <Typography variant="caption" color="text.secondary">
          Processing...
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoadingIndicator;
