import { ErrorCodeEnum, IErrorMessage, ISuccessMessage, IUser, ReqBody, SuccessCodeEnum } from '../types/types';
import { errorMessages } from '../variables/common';
import { v4 as uuidv4, validate } from 'uuid';

const users: IUser[] = [];

export class DataController {
  public users: IUser[];

  constructor() {
    this.users = users;
  }

  getUsers(): Promise<ISuccessMessage> {
    return new Promise((resolve) => {
      const result: ISuccessMessage = { code: SuccessCodeEnum.OK, data: this.users };
      resolve(result);
    });
  }

  getUser(id: string): Promise<ISuccessMessage> {
    return new Promise((resolve, reject) => {
      if (!id || !validate(id)) {
        const error: IErrorMessage = { code: ErrorCodeEnum.BAD_REQUEST, message: errorMessages.userId_is_invalid };
        reject(error);
      }

      const user = this.users.find((item) => item.id === id);
      if (user) {
        const result: ISuccessMessage = { code: SuccessCodeEnum.OK, data: user };
        resolve(result);
      } else {
        const error: IErrorMessage = { code: ErrorCodeEnum.FORBIDDEN, message: errorMessages.user_does_not_exist };
        reject(error);
      }
    });
  }

  createUser(body: ReqBody): Promise<ISuccessMessage> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();

      if (body?.username && body?.age && body?.hobbies) {
        const user = {
          id,
          ...body,
        };
        this.users.push(user);
        const result: ISuccessMessage = { code: SuccessCodeEnum.CREATED, data: user };
        resolve(result);
      } else {
        const error: IErrorMessage = { code: ErrorCodeEnum.BAD_REQUEST, message: errorMessages.required_fields };
        reject(error);
      }
    });
  }
}
