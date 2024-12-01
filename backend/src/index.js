import { connectDB } from './db/db.js';
import app from './app.js'
import agenda from './config/agenda.js';

console.log("Starting the server...");

connectDB()
  .then(async () => {
    const port = process.env.PORT || 8000;
    
    // Ensure Agenda is defined
    await new Promise((resolve) => {
      agenda.on('ready', resolve);
    });

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!!", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await agenda.stop();
  process.exit(0);
});