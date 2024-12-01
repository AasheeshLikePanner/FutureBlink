import express from 'express';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import flowChartRouter from './routes/flowChat.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config()

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });



app.get('/', (req, res)  => {
    res.send("Hellow from the server")
})

app.use('/user', userRouter)

app.use('/flowchart',flowChartRouter)

export default app;