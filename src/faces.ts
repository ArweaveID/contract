export interface StateInterface {
  accounts: { [key: string]: AccountInterface };
  takenNames: string[];
}

export interface AccountInterface {
  username?: string;
  avatar?: string;
  bio?: string;
  url?: string;
  extras?: [string, string][];
}

export interface ActionInterface {
  input: InputInterface;
  caller: string;
}

export interface ResultInterface extends AccountInterface {
  target: string;
  account?: AccountInterface;
  extra?: string;
}

export interface InputInterface extends AccountInterface {
  function: 'get' | 'set';
  request: RequestType;
  target?: string;
  key?: string;
  value?: string;
}

export type RequestType = 'account' | 'username' | 'avatar' | 'bio' | 'url' | 'extra';