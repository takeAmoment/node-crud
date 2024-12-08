import { IncomingMessage, ServerResponse } from 'http';
import { ErrorCodeEnum, HttpMethodEnum, HttpUrlEnum, IErrorMessage, ReqBody, ResData } from '../types/types';
import { errorMessages } from '../variables/common';
import { Router } from '../Router/Router';

export const getBody = (req: IncomingMessage): Promise<ReqBody> => {
  return new Promise((resolve, reject) => {
    let body: string = '';

    req
      .on('data', (chunk: Buffer) => {
        body += chunk.toString();
      })
      .on('end', () => {
        if (!body) {
          const error: IErrorMessage = { code: ErrorCodeEnum.BAD_REQUEST, message: errorMessages.required_fields };
          reject(error);
        } else {
          const data = JSON.parse(body);
          resolve(data);
        }
      })
      .on('error', () => {
        const error: IErrorMessage = { code: ErrorCodeEnum.SERVER_ERROR, message: errorMessages.something_went_wrong };
        reject(error);
      });
  });
};

export const sendResponse = (code: number, data: ResData, res: ServerResponse<IncomingMessage>) => {
  res.writeHead(code, {
    'Content-type': 'application/json',
  });
  return res.end(JSON.stringify(data));
};

const router = new Router();

export const findRoute = (
  method: HttpMethodEnum,
  path: string,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  switch (true) {
    case method === HttpMethodEnum.POST && path === HttpUrlEnum.USERS:
      router.post(req, res);
      break;
    case method === HttpMethodEnum.GET && path === HttpUrlEnum.USERS:
      router.get(req, res);
      break;
    case method === HttpMethodEnum.GET && path && path.startsWith(HttpUrlEnum.USERS):
      router.get(req, res);
      break;
    case method === HttpMethodEnum.PUT && path && path.startsWith(HttpUrlEnum.USERS):
      router.put(req, res);
      break;
    case method === HttpMethodEnum.DELETE && path && path.startsWith(HttpUrlEnum.USERS):
      router.delete(req, res);
      break;
    default:
      sendResponse(ErrorCodeEnum.FORBIDDEN, { message: errorMessages.endpoint_does_not_exist }, res);
  }
};
