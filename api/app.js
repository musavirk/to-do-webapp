import fs from 'fs';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import swaggerSpec from './config/swagger-config.js';
// import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4001;
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listener for connection error
mongoose.connection.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error('MongoDB Connection Error:', error);
});

// Event listener for successful connection
mongoose.connection.once('open', async () => {
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
});

// Event listener for disconnection
mongoose.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.log('Disconnected from MongoDB');
});

// Event listener for process termination or restart
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('App terminated');
  process.exit(0);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });
app.use(
  morgan('common', {
    skip: (req, res) => res.statusCode < 400,
    stream: accessLogStream,
  }),
);

const swaggerOptions = {
  customSiteTitle: 'ToDo APP API',
  customCss: '.topbar { display: none }',
};

app.use('/v1', routes);
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      error: 'Too many requests from this IP, please try again after 15 minutes',
      data: null,
    },
  }),
);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});
// app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
