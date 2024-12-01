import React, { useMemo , useEffect} from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { useLocation, useParams } from "react-router-dom";

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

const ReadOnlyFlowchart = () => {
  const { id } = useParams();
  const location = useLocation();
  const flowchartData = location.state?.flowchart;

  useEffect(()=> {console.log(flowchartData);
  }, [])

  const nodeTypes = useMemo(() => {
    const types = {};
    types['coldEmail'] = CustomNode;
    types['waitDelay'] = CustomNode;
    types['leadSource'] = CustomNode;
    return types;
  }, []);

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
            nodes={flowchartData.nodes}
            edges={flowchartData.edges}
            nodeTypes={nodeTypes}
            // Disable interactions
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            style={{ width: '100%', height: '100%' }}
          >
            <MiniMap zoomable pannable />
            <Controls showZoom={false} showInteractive={false} />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ReadOnlyFlowchart;