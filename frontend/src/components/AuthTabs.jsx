import React, { useState } from 'react';
import { Box, Card, Tab, Tabs, TextField, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';


const transitionVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export default function AuthTabs(props) {
  const [tabIndex, setTabIndex] = useState(0);
  const { control, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    reset(); // Reset form fields when switching tabs
  };

  const handleLogin = async (data) => {
    try {
      console.log(import.meta.env.VITE_API_PREFIX);
      
      const response = await axios.post(`${import.meta.env.VITE_API_PREFIX}/user/login`, {
        email: data.email,
        password: data.password
      }, {withCredentials:'include'});
      dispatch(login(response.data.data.user));
      props.closeAuthPage();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async (data) => {
    try {
      console.log(data);
      
      await axios.post(`${import.meta.env.VITE_API_PREFIX}/user/register`, {email:data.email, password:data.password, username:data.username});
    } catch (error) {
      console.log("Something went while sigup", error)
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_PREFIX}/user/login`, {
          email: data.email,
          password: data.password
      }, {withCredentials:'include'});
      dispatch(login(response.data.data.user));
      props.closeAuthPage();
    } catch (error) {
      console.log('Something Went Wrong While Login the User', error);
  }
  };

  const renderLoginForm = () => (
    <motion.div
      key="login"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={transitionVariants}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        sx={{ mt: 3 }}
        onSubmit={handleSubmit(handleLogin)}
      >
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              required
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
            />
          )}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#007bff',
            ':hover': { backgroundColor: '#0056b3' },
          }}
        >
          Login
        </Button>
      </Box>
    </motion.div>
  );

  const renderSignupForm = () => (
    <motion.div
      key="signup"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={transitionVariants}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        sx={{ mt: 3 }}
        onSubmit={handleSubmit(handleSignup)}
      >
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              required
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              required
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
            />
          )}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#007bff',
            ':hover': { backgroundColor: '#0056b3' },
          }}
        >
          Signup
        </Button>
      </Box>
    </motion.div>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            width: 400,
            p: 3,
            boxShadow: 5,
            borderRadius: '15px',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography variant="h4" textAlign="center" gutterBottom>
            Welcome
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" sx={{ fontWeight: 600 }} />
            <Tab label="Signup" sx={{ fontWeight: 600 }} />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {tabIndex === 0 && renderLoginForm()}
            {tabIndex === 1 && renderSignupForm()}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
}
