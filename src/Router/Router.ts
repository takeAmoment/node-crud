import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

import { DataController } from '../DataController/DataController';
import { getBody, sendResponse } from '../utilities/utilities';
import { HttpUrlEnum, IErrorMessage } from '../types/types';

export class Router {
  public dataController: DataController;

  constructor() {
    this.dataController = new DataController();
  }

  findId(req: IncomingMessage) {
    const reqUrl = req.url;
    const parsedUrl = parse(reqUrl, true);
    const id = parsedUrl.pathname.split('/')[3];

    return id;
  }

  async get(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    if (req.url === HttpUrlEnum.USERS) {
      const result = await this.dataController.getUsers();
      return sendResponse(result.code, result.data, res);
    }

    const id = this.findId(req);
    try {
      const result = await this.dataController.getUser(id);
      return sendResponse(result.code, result.data, res);
    } catch (error) {
      const castomError = error as IErrorMessage;
      return sendResponse(castomError.code, { message: castomError.message }, res);
    }
  }

  async post(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    try {
      const body = await getBody(req);
      const result = await this.dataController.createUser(body);
      sendResponse(result.code, result.data, res);
    } catch (error) {
      const castomError = error as IErrorMessage;
      return sendResponse(castomError.code, { message: castomError.message }, res);
    }
  }
}
