import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();


app.use(express.json({ limit: '50mb' })); 
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 
app.use(cookieParser());


const allowedOrigins = ['http://localhost:5173']; 
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log('Server is running on port:' + PORT);
  connectDB();
});
