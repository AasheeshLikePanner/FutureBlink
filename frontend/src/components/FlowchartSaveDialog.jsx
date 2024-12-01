import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';


const FlowchartSaveDialog = ({ 
  open, 
  onClose, 
  onSave 
}) => {
  const [flowchartName, setFlowchartName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPassword, setSenderPassword] = useState('');

  const handleSave = () => {
    if (!flowchartName || !senderEmail || !senderPassword) {
      alert('Please fill in all fields');
      return;
    }

    onSave({
      flowchartName,
      senderEmail,
      senderPassword
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Flowchart</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Flowchart Name"
            value={flowchartName}
            onChange={(e) => setFlowchartName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Sender Email"
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email Password"
            type="password"
            value={senderPassword}
            onChange={(e) => setSenderPassword(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlowchartSaveDialog;