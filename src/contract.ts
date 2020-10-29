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
    else if(request === 'name') {
      res.result.name = accounts[target].name;
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
    else if(request === 'extra') {
      res.result.extra = (new Map(accounts[target].extras || [])).get(input.key);
    } else {
      throw new ContractError('Invalid request.');
    }

    return res;
  }

  // Setter
  if(input.function === 'set') {
    let acc = createAccountIfNotExists();
    
    let name: string = clean(input.name || acc.name);
    let avatar: string = validateTxId(clean(input.avatar || acc.avatar));
    let bio: string = clean(input.bio || acc.bio);
    let url: string = clean(input.url || acc.url);
    let extras: [string, string][] = acc.extras;
    let kvs: {[key: string]: string} = input.extras || {};

    if(Object.keys(kvs).length) {
      const extrasMap = new Map(extras);
      for(const kv in kvs) {
        const k = clean(kv);
        const v = clean(kvs[kv]);

        if(k.length && v.length) {
          extrasMap.set(k, v);
        }
      }
      extras = Array.from(extrasMap);
    }

    if(name.length == 0) {
      throw new ContractError('No name provided.')
    }

    if(request === 'account') {
      if(name && acc.name !== name && (input.name in takenNames)) {
        throw new ContractError('Name already taken.');
      }

      if(acc.name !== name) {
        takenNames.splice(takenNames.indexOf(acc.name), 1);
        takenNames.push(name);
      }

      acc = { name, avatar, bio, url, extras };
      accounts[caller] = acc;

    } else if(request === 'name') {
      if(input.name in takenNames) {
        throw new ContractError('Name already taken.');
      }

      if(acc.name !== name) {
        takenNames.splice(takenNames.indexOf(acc.name), 1);
        takenNames.push(name);
      }
      accounts[caller].name = name;

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
    if(!str.length) return str;

    if(!/[a-z0-9_-]{43}/i.test(str)) {
      throw new ContractError(`${str} is not a transaction ID.`);
    }
    return str;
  }

  function createAccountIfNotExists() {
    if(!(caller in accounts)) {
      accounts[caller] = {
        name: '',
        avatar: '',
        bio: '',
        url: '',
        extras: []
      };
    }
    return accounts[caller];
  }
}
