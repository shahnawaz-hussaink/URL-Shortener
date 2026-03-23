import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// config

app.use(
  // allow to talk to these origins only
  cors({
    origin: process.env.CORS,
    credentials: true,
  }),
);

app.use(
  express.json({
    size: '16kb',
  }),
);

app.use(
  // it will allow nested object type returning
  express.urlencoded({
    extended: true,
    size: '16kb',
  }),
);

app.use(cookieParser());

// routes importing

import urlShortenerRoute from './routes/urlShortener.route.js';
import userRoute from './routes/user.route.js';

app.use('/api/v1/url', urlShortenerRoute);

app.use('/api/v1/user', userRoute);

export { app };
