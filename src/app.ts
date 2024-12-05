import { createServer } from 'http';
import * as dotenv from 'dotenv';
import { HttpMethodEnum, HttpUrlEnum } from './types/types';
import { Router } from './Router/Router';

dotenv.config();

const PORT = process.env.PORT;
const router = new Router();

const server = createServer((req, res) => {
  switch (true) {
    case req.method === HttpMethodEnum.POST && req.url === HttpUrlEnum.USERS:
      router.post(req, res);
      break;
    case req.method === HttpMethodEnum.GET && req.url === HttpUrlEnum.USERS:
      router.get(req, res);
      break;
    case req.method === HttpMethodEnum.GET && req.url.startsWith(HttpUrlEnum.USERS):
      router.get(req, res);
      break;
    default:
      console.log('no such endpoint');
  }
  // res.end(`Hello world ${req.method} ${req.method === HttpMethodEnum.POST && req.url === HttpUrlEnum.POST_USERS}`)
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
