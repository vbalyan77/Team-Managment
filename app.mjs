import express from 'express';
// import mongoose from 'mongoose';
// import { ApiError } from './errors/ApiError';
// import { authRouter } from './routes/auth';
// import { galleryRouter } from './routes/gallery';

const app = express();
const port = 3000 || process.env.PORT;

// mongoose.connect(''); Insert your connection uri
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/', authRouter);
// app.use('/gallery', galleryRouter);

// error handler
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json(new ApiError(err, err.status || 500));
};
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️ Server is running on port ${port}!`);
});
