// require("typescript.api").register();

import Arweave from 'arweave';
import * as fs from 'fs';
import { createContractExecutionEnvironment } from './swglobal/contract-load';

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443
});

const { handle } = require('../contract.ts');
let state = JSON.parse(fs.readFileSync('./src/states.json', 'utf8'));

let { handler, swGlobal } = createContractExecutionEnvironment(arweave, handle.toString(), 'bYz5YKzHH97983nS8UWtqjrlhBHekyy-kvHt_eBxBBY');

describe('Get functions', () => {
  it('should return someone\'s account', async () => {
    const res = await handler(state, {input: {
      function: 'get',
      request: 'account',
      target: 'v2XXwq_FvVqH2KR4p_x8H-SQ7rDwZBbykSv-59__Avc'
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(res.result.account).toStrictEqual(state.accounts['v2XXwq_FvVqH2KR4p_x8H-SQ7rDwZBbykSv-59__Avc']);
  });

  it('should return the caller\'s account', async () => {
    const res = await handler(state, {input: {
      function: 'get',
      request: 'account',
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(res.result.account).toBe(state.accounts['BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU']);
  });

  it('should return the caller\'s name', async () => {
    const res = await handler(state, {input: {
      function: 'get',
      request: 'name',
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(res.result.name).toBe(state.accounts['BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'].name);
  });

  it('should return an empty name', async () => {
    try {
      await handler(state, {input: {
        function: 'get',
        request: 'name',
      }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU'});
    } catch (e) {
      expect(e.name).toBe('ContractError');
    }
  });

  it('should return the caller\'s avatar', async () => {
    const res = await handler(state, {input: {
      function: 'get',
      request: 'avatar',
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(res.result.avatar).toBe(state.accounts['BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'].avatar);
  });

  it('should return the caller\'s bio', async () => {
    const res = await handler(state, {input: {
      function: 'get',
      request: 'bio',
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(res.result.bio).toBe(state.accounts['BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'].bio);
  });

  it('should return the caller\'s url', async () => {
    const res = await handler(state, {input: {
      function: 'get',
      request: 'url',
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(res.result.url).toBe(state.accounts['BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'].url);
  });
});

describe('Set functions', () => {
  const caller = 'BPr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU';
  
  it('should set a new account', async () => {
    const account = {
      name: 'test account',
      avatar: 'BPr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU',
      bio: 'This is my bio',
      url: 'https://test.com',
      extras: []
    };

    handler(state, {input: {
      function: 'set',
      request: 'account',
      name: account.name,
      avatar: account.avatar,
      bio: account.bio,
      url: account.url
    }, caller});

    expect(state.accounts[caller]).toStrictEqual(account);
  });

  it('should update an existing account', async () => {
    const account = {
      name: 'test account',
      avatar: 'BPr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU',
      bio: 'This is my bio',
      url: 'https://test.com',
      extras: []
    };

    handler(state, {input: {
      function: 'set',
      request: 'account',
      name: account.name,
      avatar: account.avatar,
      bio: account.bio,
      url: account.url
    }, caller: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU'});

    expect(state.accounts['BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU']).toStrictEqual(account);
  });

  it('should set a name', async () => {
    const name = 'asdf';
    handler(state, {input: {
      function: 'set',
      request: 'name',
      name
    }, caller: 'APr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU'});

    expect(state.accounts['APr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU'].name).toBe(name);
  });

  it('should update a name', async () => {
    const name = 'asdf';
    handler(state, {input: {
      function: 'set',
      request: 'name',
      name
    }, caller});

    expect(state.accounts[caller].name).toBe(name);
  });

  it('should update an avatar', async () => {
    const avatar = 'APr7vrFduuQqqVMu_tftxsScTKUq8ke0rx4q5C9ieQU';
    handler(state, {input: {
      function: 'set',
      request: 'avatar',
      avatar
    }, caller});

    expect(state.accounts[caller].avatar).toBe(avatar);
  });

  it('should update a bio', async () => {
    const bio = 'This is a bio!';
    handler(state, {input: {
      function: 'set',
      request: 'bio',
      bio
    }, caller});

    expect(state.accounts[caller].bio).toBe(bio);
  });

  it('should update an url', async () => {
    const url = 'https://www.google.com';
    handler(state, {input: {
      function: 'set',
      request: 'url',
      url
    }, caller});

    expect(state.accounts[caller].url).toBe(url);
  });

  it('should allow custom tags', async () => {
    handler(state, {input: {
      function: 'set',
      request: 'extra',
      extras: {random: 'name', isAvailable: true}
    }, caller});

    const m = new Map(state.accounts[caller].extras);
    expect(m.get('random')).toBe('name');
    expect(m.get('isAvailable')).toBe('true');

    const res = await handler(state, {input: {
      function: 'get',
      request: 'extra',
      key: 'random'
    }, caller});

    expect(res.result.extra).toBe('name');
  });

});