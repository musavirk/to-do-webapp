import mongoose from 'mongoose';

const errorHandlerMiddleware = (err, req, res) => {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (typeof err === 'object' && err instanceof mongoose.CastError) {
    statusCode = 400;
    errorMessage = 'Cast Error';
  } else if (typeof err === 'object' && err instanceof mongoose.MongoError) {
    statusCode = 500;
    errorMessage = 'MongoDB Error';
  }

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(statusCode).json({ error: errorMessage, data: null });
};

export default errorHandlerMiddleware;
