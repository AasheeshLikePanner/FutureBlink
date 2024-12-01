import React from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Paper, Typography } from '@mui/material';
import { Handle as ReactFlowHandle } from 'reactflow';

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 300
    }
  }
};

const nodeStyles = {
  coldEmail: {
    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    border: '1px solid #64b5f6',
  },
  waitDelay: {
    background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    border: '1px solid #ffb74d',
  },
  leadSource: {
    background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    border: '1px solid #81c784',
  }
};


const CustomNode = ({ data, type }) => {
  const renderContent = () => {
    switch (type) {
      case 'coldEmail':
        return data.content || 'No content set';
      case 'waitDelay':
        return `${data.delay?.hours || 0} hrs ${data.delay?.minutes || 0} mins`;
      case 'leadSource':
        return data.source || data.emailAddress || 'No source set';
      default:
        return '';
    }
  };
  
  return (
    <motion.div
      variants={nodeVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div style={{ position: 'relative', width: '200px', padding: '10px' }}>
        <ReactFlowHandle
          type="target"
          position={Position.Bottom}
          style={{
            background: '#555',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        <ReactFlowHandle
          type="source"
          position={Position.Top}
          style={{
            background: '#555',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        
        <Paper
          elevation={3}
          sx={{
            ...nodeStyles[type],
            padding: '12px',
            minWidth: '180px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {type === 'coldEmail'
              ? 'Cold Email'
              : type === 'waitDelay'
              ? 'Wait/Delay'
              : 'Lead Source'}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '8px' }}>
            {renderContent()}
          </Typography>
        </Paper>
      </div>
    </motion.div>
  );
};

export default CustomNode;