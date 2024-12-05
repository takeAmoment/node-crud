import { IncomingMessage, ServerResponse } from 'http';
import { ErrorCodeEnum, IErrorMessage, ReqBody, ResData } from '../types/types';
import { errorMessages } from '../variables/common';

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
