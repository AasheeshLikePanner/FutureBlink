import { v4 as uuidv4 } from 'uuid';
import React from 'react';

export const calculateScheduleTime = (delay) => {
  const hours = delay.hours ? parseInt(delay.hours.toString()) : 0;
  const minutes = delay.minutes ? parseInt(delay.minutes.toString()) : 0;
  
  const scheduledTime = new Date();
  scheduledTime.setHours(scheduledTime.getHours() + hours);
  scheduledTime.setMinutes(scheduledTime.getMinutes() + minutes);
  
  return scheduledTime;
};

export const createNode = (type) => {
  return {
    id: uuidv4(),
    type,
    position: { 
      x: Math.random() * 250, 
      y: Math.random() * 150 
    },
    data: { 
      content: '', 
      delay: { hours: '', minutes: '' }, 
      source: '',
      emailAddress: ''
    },
    style: { width: '200px' }
  };
};

export const getNodeTypes = (CustomNode) => ({
  coldEmail: (props) => React.createElement(CustomNode, { ...props, type: 'coldEmail' }),
  waitDelay: (props) => React.createElement(CustomNode, { ...props, type: 'waitDelay' }),
  leadSource: (props) => React.createElement(CustomNode, { ...props, type: 'leadSource' }),
});