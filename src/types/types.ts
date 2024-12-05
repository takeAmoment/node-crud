export enum HttpMethodEnum {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum HttpUrlEnum {
  USERS = '/api/users',
}

export enum SuccessCodeEnum {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
}

export enum ErrorCodeEnum {
  BAD_REQUEST = 400,
  FORBIDDEN = 404,
  SERVER_ERROR = 500,
}

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
export interface IMessage {
  message: string;
}

export type ReqBody = Omit<IUser, 'id'>;
export type ResData = IUser | IMessage | IUser[];

export interface ISuccessMessage {
  code: SuccessCodeEnum;
  data: IUser | IUser[];
}

export interface IErrorMessage {
  code: ErrorCodeEnum;
  message: string;
}
