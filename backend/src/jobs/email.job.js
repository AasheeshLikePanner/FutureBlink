import createTransporter from '../utils/nodemailer.js';

export default (agenda) => {
  agenda.define('send email', { priority: 'high', concurrency: 5 }, async (job) => {
    console.log(`Starting job: ${job.attrs._id}`);
    
    const { emailBody, emailAddress, senderEmail, senderPassword } = job.attrs.data;
    
    console.log('Job Details:', {
      jobId: job.attrs._id,
      emailAddress,
      senderEmail,
      scheduledTime: job.attrs.nextRunAt
    });
    
    try {
      const transporter = createTransporter({ senderEmail, senderPassword });
      
      const mailOptions = {
        from: senderEmail,
        to: emailAddress,
        subject: 'Scheduled Email',
        text: emailBody,
        html: `<p>${emailBody}</p>`
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log(`Email sent successfully to ${emailAddress}`);
      console.log('Email send info:', info);
      
      // Mark job as complete
      await job.save({ state: 'completed' });
    } catch (error) {
      console.error(`Failed to send email to ${emailAddress}:`, error);
      
      // Mark job as failed
      await job.save({ state: 'failed', failedAt: new Date(), error: error.message });
      
      // Optionally, you might want to throw the error to retry
      throw error;
    }
  });

  // Optional: Add recurring job processing
  agenda.on('complete', (job) => {
    console.log(`Job ${job.attrs._id} completed`);
  });

  agenda.on('fail', (error, job) => {
    console.error(`Job ${job.attrs._id} failed:`, error);
  });
};