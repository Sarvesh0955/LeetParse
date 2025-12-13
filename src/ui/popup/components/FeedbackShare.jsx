import React from 'react';
import {
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon,
  StarRate as StarRateIcon
} from '@mui/icons-material';

const FeedbackShare = ({ open, onClose, onRate }) => {
  return (
    <Collapse in={open} timeout={200} unmountOnExit>
      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          p: 2,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={0.5} sx={{ pr: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Did this help?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rate us ★★★★★ and help others find LeetParse.
            </Typography>
          </Stack>
          <IconButton size="small" aria-label="Dismiss" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={onRate}
            sx={{ flex: 1 }}
          >
            Rate us ★★★★★
          </Button>
        </Stack>
      </Paper>
    </Collapse>
  );
};

export default FeedbackShare;
