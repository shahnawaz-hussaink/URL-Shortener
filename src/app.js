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

app.get('/', (req, res) => {
  res.send('<h1>URL Shortener</h1>');
});

export { app };
