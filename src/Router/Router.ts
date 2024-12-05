import { IncomingMessage, ServerResponse } from 'http';
import { DataController } from '../DataController/DataController';
import { getBody, sendResponse } from '../utilities/utilities';
import { IErrorMessage } from '../types/types';

export class Router {
  public dataController: DataController;

  constructor() {
    this.dataController = new DataController();
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
