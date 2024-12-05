import { ErrorCodeEnum, IErrorMessage, ISuccessMessage, IUser, ReqBody, SuccessCodeEnum } from '../types/types';
import { errorMessages } from '../variables/common';
import { v4 as uuidv4 } from 'uuid';

const users: IUser[] = [];

export class DataController {
  public users: IUser[];

  constructor() {
    this.users = users;
  }

  getUsers() {
    return users;
  }

  createUser(body: ReqBody): Promise<ISuccessMessage> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();

      if (body?.username && body?.age && body?.hobbies) {
        const user = {
          id,
          ...body,
        };

        const result: ISuccessMessage = { code: SuccessCodeEnum.CREATED, data: user };
        resolve(result);
      } else {
        const error: IErrorMessage = { code: ErrorCodeEnum.BAD_REQUEST, message: errorMessages.required_fields };
        reject(error);
      }
    });
  }
}
