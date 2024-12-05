import { ErrorCodeEnum, IErrorMessage, ISuccessMessage, IUser, ReqBody, SuccessCodeEnum } from '../types/types';
import { errorMessages } from '../variables/common';
import { v4 as uuidv4, validate } from 'uuid';

const users: IUser[] = [];

export class DataController {
  public users: IUser[];

  constructor() {
    this.users = users;
  }

  public findUser(id: string): IUser {
    return this.users.find((item) => item.id === id);
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

      const user = this.findUser(id);
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

  updateUser(id: string, body: ReqBody): Promise<ISuccessMessage> {
    return new Promise((resolve, reject) => {
      if (!id || !validate(id)) {
        const error: IErrorMessage = { code: ErrorCodeEnum.BAD_REQUEST, message: errorMessages.userId_is_invalid };
        reject(error);
      }

      const user = this.findUser(id);
      if (user) {
        let updatedUser = user;
        this.users = this.users.map((item) => {
          if (item.id === id) {
            updatedUser = {
              id: item.id,
              ...body,
            };

            return updatedUser;
          }
          return item;
        });

        const result: ISuccessMessage = { code: SuccessCodeEnum.OK, data: updatedUser };
        resolve(result);
      } else {
        const error: IErrorMessage = { code: ErrorCodeEnum.FORBIDDEN, message: errorMessages.user_does_not_exist };
        reject(error);
      }
    });
  }

  deleteUser(id: string): Promise<ISuccessMessage> {
    return new Promise((resolve, reject) => {
      if (!id || !validate(id)) {
        const error: IErrorMessage = { code: ErrorCodeEnum.BAD_REQUEST, message: errorMessages.userId_is_invalid };
        reject(error);
      }

      const user = this.findUser(id);
      if (user) {
        this.users = this.users.filter((item) => item.id !== user.id);
        const result = { code: SuccessCodeEnum.NO_CONTENT, data: { message: 'User was deleted' } };
        resolve(result);
      } else {
        const error: IErrorMessage = { code: ErrorCodeEnum.FORBIDDEN, message: errorMessages.user_does_not_exist };
        reject(error);
      }
    });
  }
}
