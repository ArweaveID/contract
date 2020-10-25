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

const addresses = {
  zeus: 'BPr7vrFduuQqqVMu_tftxsScTKUq9ke0rx4q5C9ieQU',
  random: 'asdfasdf'
};

