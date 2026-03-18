import express, { urlencoded } from 'express';
import cors from 'cors';

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
// routes 

import urlShortener from './routes/urlShortener.route.js'

app.use("/api/v1/url",urlShortener)

export { app };
