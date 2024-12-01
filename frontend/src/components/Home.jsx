import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Button, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.2)' },
};

const buttonVariants = {
  hover: { scale: 1.1 },
};

export default function Homepage() {
  const [flowcharts, setFlowcharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const fetchFlowcharts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_PREFIX}/flowchart/get-all-flowchart`, {withCredentials:"true"});
      setFlowcharts(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error fetching flowcharts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowcharts();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          backgroundColor: '#f9fafc',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Dashboard
          </Typography>
          <motion.div variants={buttonVariants} whileHover="hover">
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                ':hover': { backgroundColor: '#1565c0' },
                padding: '8px 16px',
                fontWeight: 'bold',
              }}
              onClick={() => {
                window.location.href = '/new-flowchart';
              }}
            >
              New Flowchart
            </Button>
          </motion.div>
        </Box>

        {/* Flowchart Cards Section */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            padding: 4,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : flowcharts.length > 0 ? (
            <Grid container spacing={3}>
              {flowcharts.map((flowchart, index) => (
                <Grid item xs={12} sm={6} md={4} key={flowchart._id}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        borderRadius: '12px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                      onClick={() => {
                        navigate(`/flowchart/${flowchart._id}`, { state: { flowchart } });
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'bold', marginBottom: 1 }}
                        >
                          {flowchart.name || `Flowchart ${index + 1}`}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ marginBottom: 1 }}
                        >
                          Created on: {new Date(flowchart.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#1976d2',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          View Details
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: '#666',
                  marginTop: 3,
                }}
              >
                No flowcharts found. Start by creating a new one!
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
