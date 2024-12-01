import Agenda from "agenda"
import mongoose from 'mongoose';
import { DB_NAME } from "../utils/constants.js";

const agenda = new Agenda({ 
  db: { 
    address: `${process.env.MONGODB_URI}/${DB_NAME}`,
    collection: "agendaJobs" 
  }
});


agenda.on('ready', async () => {
  console.log('Agenda is ready');
  
  const emailJobModule = await import('../jobs/email.job.js');
  emailJobModule.default(agenda);

  try {
    await agenda.start();
    console.log('Agenda started and ready to process jobs');
  } catch (error) {
    console.error('Failed to start Agenda:', error);
  }
});

agenda.on('error', (error) => {
  console.error('Agenda error:', error);
});

export default agenda;