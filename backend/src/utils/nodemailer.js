import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

const cachedTransport = new Map();

const createTransporter = ({ senderEmail, senderPassword }) => {
  if(cachedTransport.has(senderEmail)){
    return cachedTransport.get(senderEmail);
  }
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASSWORD
      }
    });

    cachedTransport.set(senderEmail, transporter);
    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw new Error('Failed to create transporter');
  }
};

export default createTransporter;