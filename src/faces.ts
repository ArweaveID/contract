export interface StateInterface {
  accounts: { [key: string]: AccountInterface };
  takenNames: string[];
}

export interface AccountInterface {
  name?: string;
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

export interface InputInterface {
  function: 'get' | 'set';
  request: RequestType;
  target?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  url?: string;
  key?: string;
  extras?: {[key: string]: string};
}

export type RequestType = 'account' | 'name' | 'avatar' | 'bio' | 'url' | 'extra';