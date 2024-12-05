import { createServer } from 'http';
import * as dotenv from 'dotenv';
import { ErrorCodeEnum, HttpMethodEnum, HttpUrlEnum } from './types/types';
import { Router } from './Router/Router';
import { sendResponse } from './utilities/utilities';
import { errorMessages } from './variables/common';

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
    case req.method === HttpMethodEnum.PUT && req.url.startsWith(HttpUrlEnum.USERS):
      router.put(req, res);
      break;
    default:
      sendResponse(ErrorCodeEnum.FORBIDDEN, { message: errorMessages.endpoint_does_not_exist }, res);
  }
  // res.end(`Hello world ${req.method} ${req.method === HttpMethodEnum.POST && req.url === HttpUrlEnum.POST_USERS}`)
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
