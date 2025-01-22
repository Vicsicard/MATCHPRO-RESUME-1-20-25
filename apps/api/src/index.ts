import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import resumesRouter from './routes/resumes';
import applicationsRouter from './routes/applications';
import profileRouter from './routes/profile';
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import { specs } from './swagger';

// Log environment variables (without sensitive values)
console.log('Environment variables loaded:', {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
});

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/jobs', jobsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});
