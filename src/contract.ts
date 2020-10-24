import { StateInterface, ActionInterface, InputInterface, RequestType, ResultInterface } from "./faces";

declare const ContractError: any;
declare const SmartWeave: any;

export function handle(state: StateInterface, action: ActionInterface) {
  const accounts = state.accounts;
  const takenNames = state.takenNames;
  const input: InputInterface = action.input;
  const caller: string = action.caller;
  const request: RequestType = input.request;
  
  // Getter
  if(input.function === 'get') {
    const target = input.target || caller;
    if(!(target in accounts)) {
      throw new ContractError('Account not found.');
    }

    const res: {result: ResultInterface } = { result: {target}};
    if(request === 'account') {
      res.result.account = accounts[target];
    }
    else if(request === 'username') {
      res.result.username = accounts[target].username;
    }
    else if(request === 'avatar') {
      res.result.avatar = accounts[target].avatar;
    }
    else if(request === 'bio') {
      res.result.bio = accounts[target].bio;
    }
    else if(request === 'url') {
      res.result.url = accounts[target].url;
    }
    else if(request.length) {
      res.result.extra = (new Map(accounts[target].extras || [])).get(input.key);
    } else {
      throw new ContractError('Invalid request.');
    }

    return res;
  }

  // Setter
  if(input.function === 'set') {
    let acc = createAccountIfNotExists();
    
    let username: string = clean(input.username || acc.username);
    let avatar: string = validateTxId(clean(input.avatar || acc.avatar));
    let bio: string = clean(input.bio || acc.bio);
    let url: string = clean(input.url || acc.url);
    let extras: [string, string][] = acc.extras;
    
    let key: string = clean(input.key || '');
    let value: string = clean(input.value || '');

    if(key.length && value.length) {
      const extrasMap = new Map(extras);
      extrasMap.set(key, value);
      extras = Array.from(extrasMap);
    }

    if(request === 'account') {
      if(username && acc.username !== username && (input.username in takenNames)) {
        throw new ContractError('Username already taken.');
      }

      if(acc.username !== username) {
        takenNames.splice(takenNames.indexOf(acc.username), 1);
        takenNames.push(username);
      }

      acc = { username, avatar, bio, url, extras };
      accounts[caller] = acc;

    } else if(request === 'username') {
      if(input.username in takenNames) {
        throw new ContractError('Username already taken.');
      }

      if(acc.username !== username) {
        takenNames.splice(takenNames.indexOf(acc.username), 1);
        takenNames.push(username);
      }
      acc.username = username;

    } else if(request === 'avatar') {
      accounts[caller].avatar = avatar;
    
    } else if(request === 'bio') {
      accounts[caller].bio = bio;
    } else if(request === 'url') {
      accounts[caller].url = url;
    } else if(request === 'extra') {
      accounts[caller].extras = extras;
    }

    return { state };
  }

  function clean(str: string) {
    return str.toString().replace(/(<([^>]+)>)/ig, '').trim();
  }

  function validateTxId(str: string) {
    if(!/[a-z0-9_-]{43}/i.test(str)) {
      throw new ContractError(`${str} is not a transaction ID.`);
    }
    return str;
  }

  function createAccountIfNotExists() {
    if(!(caller in accounts)) {
      accounts[caller] = {
        username: '',
        avatar: '',
        bio: '',
        url: '',
        extras: []
      };
    }
    return accounts[caller];
  }
}
