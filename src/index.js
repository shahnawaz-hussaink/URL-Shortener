import { app } from './app.js';
import dbConnect from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const port = process.env.PORT;

dbConnect()
  .then((res) => {
    app.listen(port || 3000, () => {
      console.log(`App Is listening on Port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Backend failed while listening on PORT!!!');
  });
