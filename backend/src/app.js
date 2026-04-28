import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

export default app;
