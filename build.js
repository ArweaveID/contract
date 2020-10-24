const { build } = require('esbuild');
const glob = require('glob');
const fs = require('fs');

build({
  entryPoints: ['./src/contract.ts'],
  outdir: './dist',
  minify: false,
  bundle: false
}).catch(() => process.exit(1));