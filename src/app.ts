import { createServer } from 'http';
import * as dotenv from 'dotenv';
import { HttpMethodEnum } from './types/types';
import { findRoute } from './utility/utilities';

dotenv.config();

const PORT = process.env.PORT;

const server = createServer((req, res) => {
  const method = req.method as HttpMethodEnum;
  const path = req.url || '';
  findRoute(method, path, req, res);
  // res.end(`Hello world ${req.method} ${req.method === HttpMethodEnum.POST && req.url === HttpUrlEnum.POST_USERS}`)
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
