import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { usersRoute } from './api/users/users.router';
import 'reflect-metadata';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || '8000';

app.use('/api/users', usersRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Home');
});

app.listen(port, () => {
  console.log('[server]: is listening at port http://localhost:' + port);
  console.log('[__dirname]: ' + __dirname);
});
