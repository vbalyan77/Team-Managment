import express, { Application, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ApiError } from './errors/ApiError';
import 'dotenv/config';

import { authRouter } from './routes/auth';
import { teamRouter } from './routes/team';

const app: Application = express();
const port: any = 3000 || process.env.PORT;

mongoose.connect('mongodb://localhost:27017/task-management'); //Insert your connection uri
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/team', teamRouter);

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json(new ApiError(err, err.status || 500));
};
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`⚡️ Server is running on port ${port}!`);
  });
}

export default app;
