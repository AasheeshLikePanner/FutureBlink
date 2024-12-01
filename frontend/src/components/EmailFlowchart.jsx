import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
} from 'reactflow';
import moment from 'moment-timezone'
import { motion } from 'framer-motion';
import { Box, Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import NodeConfigDialog from './NodeConfigDialog';
import FlowchartSaveDialog from './FlowchartSaveDialog';
import NodeAddButtons from './NodeAddButtons';
import { 
  createNode, 
  getNodeTypes 
} from '../utils/flowchartUtils';

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const EmailFlowchart = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Connection handler
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({
      ...connection,
      type: ConnectionLineType.Smoothstep,
      animated: true,
      style: { strokeWidth: 2, stroke: '#1976d2', strokeDasharray: '5,5' }
    }, eds)),
    []
  );

  const nodeTypes = useMemo(() => getNodeTypes(CustomNode), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleAddNode = (type) => {
    const newNode = createNode(type);
    setNodes((nds) => [...nds, newNode]);
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsNodeDialogOpen(true);
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === updatedNode.id ? updatedNode : node
      )
    );
  };

  const handleDeleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => 
      eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setIsNodeDialogOpen(false);
  };
  
  function calculateScheduleTime(delay) {
    const istTime = moment().tz('Asia/Kolkata');  // Current IST time
    console.log("IST Time:", istTime.format());  // For debugging, prints current IST time
    
    const delayMillis = (parseInt(delay.hours || 0) * 60 * 60 * 1000) + (parseInt(delay.minutes || 0) * 60 * 1000);
    
    const scheduledTime = istTime.add(delayMillis, 'milliseconds');
  
    const utcTime = scheduledTime.utc(); // Convert to UTC
  
    return utcTime.toISOString();
  }
  

  const handleSaveFlowchart = async (saveDetails) => {
    try {
      const emailNode = nodes.find((node) => node.type === 'coldEmail');
      const delayNode = nodes.find((node) => node.type === 'waitDelay');
      const leadSourceNode = nodes.find((node) => node.type === 'leadSource');

      if (!emailNode || !delayNode || !leadSourceNode) {
        alert('Flowchart must include Cold Email, Wait/Delay, and Lead Source nodes.');
        return;
      }

      const payload = {
        name: saveDetails.flowchartName,
        nodes,
        edges,
      };

      await axios.post(`${import.meta.env.VITE_API_PREFIX}/flowchart/save-flowchart`, payload, {withCredentials:true});
      
      const emailDetails = {
        emailBody: emailNode.data.content,
        emailAddress: leadSourceNode.data.emailAddress,
        senderEmail: saveDetails.senderEmail,
        senderPassword: saveDetails.senderPassword,
        time: calculateScheduleTime(delayNode.data.delay),
      };
      console.log(calculateScheduleTime(delayNode.data.delay));
      

      await axios.post(`${import.meta.env.VITE_API_PREFIX}/flowchart/schedule-email`, emailDetails, {withCredentials:true});

      alert('Flowchart saved and email scheduled successfully!');
      setIsSaveDialogOpen(false);
    } catch (error) {
      console.error('Error saving flowchart or scheduling email:', error);
      alert('Failed to save flowchart or schedule email.');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ height: '100vh' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: '#f4f7f6',
          padding: '20px',
        }}
      >
        {/* Flowchart Area */}
        <Box sx={{ flexGrow: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            style={{ width: '100%', height: '100%' }}
          >
            <MiniMap />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </Box>
        
        {/* Bottom Control Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <NodeAddButtons onAddNode={handleAddNode} />

          <Box>
            <Button 
              onClick={() => setIsSaveDialogOpen(true)} 
              startIcon={<SaveIcon />}
            >
              Save Flowchart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Node Configuration Dialog */}
      <NodeConfigDialog
        open={isNodeDialogOpen}
        onClose={() => setIsNodeDialogOpen(false)}
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />

      {/* Flowchart Save Dialog */}
      <FlowchartSaveDialog
        open={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveFlowchart}
      />
    </motion.div>
  );
};

export default EmailFlowchart;