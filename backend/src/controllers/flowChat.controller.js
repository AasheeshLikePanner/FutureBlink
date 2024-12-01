import {AsyncHandler} from '../utils/AsyncHandler.js'
import agenda from '../config/agenda.js';
import { Flowchart } from '../models/flowChart.model.js';
import { ApiError } from '../utils/ApiError.js';

const scheduleEmail = AsyncHandler(async (req, res) => {
    const { time, emailBody, emailAddress, senderEmail, senderPassword } = req.body;

    if (!time || !emailBody || !emailAddress || !senderEmail || !senderPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    try {
      const scheduledJob = await agenda.schedule(time, 'send email', { 
        emailBody, 
        emailAddress, 
        senderEmail, 
        senderPassword 
      });
      console.log("Mail set", scheduledJob.attrs);
      
      res.status(200).json({ message: 'Email scheduled successfully!' });
    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Internal Server Error');
    }
})

const saveFlowChart = AsyncHandler(async (req, res) => {

  const {  name, nodes, edges } = req.body;


  if (!name || name.trim() === '') {
      console.error('Validation Error: Invalid name');
      return res.status(400).json({ 
          error: 'Flowchart name is required and cannot be empty.',
          details: 'name was either missing or an empty string' 
      });
  }
    
      const flowchart = new Flowchart({ 
          userId:req.user._id, 
          name: name.trim(), 
          nodes, 
          edges 
      });

      await flowchart.save();

      res.status(201).json({ 
          message: 'Flowchart saved successfully!', 
          id: flowchart._id 
      });
});
const getAllFlowChat = AsyncHandler(async (req, res) => {
    console.log(req.user);
    
    const userId  = req.user._id;
    console.log(userId);
    

  try {
    const flowcharts = await Flowchart.find({ userId });
    console.log(flowcharts);
    
    if (!flowcharts.length) {
      return res.status(404).json({ error: 'No flowcharts found for this user.' });
    }
    res.status(200).json(flowcharts);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch flowcharts.")
  }
})

export{
    scheduleEmail,
    saveFlowChart,
    getAllFlowChat
}