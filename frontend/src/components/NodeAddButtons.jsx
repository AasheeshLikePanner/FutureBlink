import React from 'react';
import { Box, Tooltip, Button } from '@mui/material';
import { 
  Add as AddIcon, 
  TimerOutlined as TimerIcon,
  SourceOutlined as SourceIcon 
} from '@mui/icons-material';

const NodeAddButtons = ({ onAddNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Tooltip title="Add Cold Email Node">
        <Button onClick={() => onAddNode('coldEmail')}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Add Wait/Delay Node">
        <Button onClick={() => onAddNode('waitDelay')}>
          <TimerIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Add Lead Source Node">
        <Button onClick={() => onAddNode('leadSource')}>
          <SourceIcon />
        </Button>
      </Tooltip>
    </Box>
  );
};

export default NodeAddButtons;