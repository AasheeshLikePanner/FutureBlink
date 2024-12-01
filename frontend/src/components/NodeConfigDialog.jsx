import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const NodeConfigDialog = ({
  open,
  onClose,
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}) => {
  // Use local state to manage input values
  const [nodeData, setNodeData] = useState({});

  // Update local state when selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      setNodeData({ ...selectedNode.data });
    }
  }, [selectedNode]);

  // If no node is selected, return null
  if (!selectedNode) return null;

  // Handle change with controlled input
  const handleChange = (field, value) => {
    let updatedData;
    switch (selectedNode.type) {
      case 'coldEmail':
        updatedData = { ...nodeData, content: value };
        break;
      case 'waitDelay':
        const [timeType, timeValue] = field.split('_');
        updatedData = {
          ...nodeData,
          delay: {
            ...(nodeData.delay || {}),
            [timeType]: value
          }
        };
        break;
      case 'leadSource':
        updatedData = { ...nodeData, [field]: value };
        break;
      default:
        updatedData = nodeData;
    }
    
    // Update local state
    setNodeData(updatedData);
  };

  // Save handler to propagate changes
  const handleSave = () => {
    const updatedNode = {
      ...selectedNode,
      data: nodeData
    };
    onUpdateNode(updatedNode);
    onClose();
  };

  // Render content based on the selected node type
  const renderContent = () => {
    switch (selectedNode.type) {
      case 'coldEmail':
        return (
          <TextField
            fullWidth
            label="Content"
            value={nodeData.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            multiline
            rows={4}
          />
        );
      case 'waitDelay':
        return (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <TextField
              label="Hours"
              type="number"
              value={nodeData.delay?.hours || ''}
              onChange={(e) => handleChange('hours', e.target.value)}
              InputProps={{
                inputProps: { 
                  min: 0,
                  step: 1
                }
              }}
            />
            <TextField
              label="Minutes"
              type="number"
              value={nodeData.delay?.minutes || ''}
              onChange={(e) => handleChange('minutes', e.target.value)}
              InputProps={{
                inputProps: { 
                  min: 0,
                  max: 59,
                  step: 1
                }
              }}
            />
          </Box>
        );
      case 'leadSource':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Source"
              value={nodeData.source || ''}
              onChange={(e) => handleChange('source', e.target.value)}
            />
            <TextField
              label="Email Address"
              value={nodeData.emailAddress || ''}
              onChange={(e) => handleChange('emailAddress', e.target.value)}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Configure {selectedNode.type.replace(/([A-Z])/g, ' $1')}
      </DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          Delete Node
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeConfigDialog;