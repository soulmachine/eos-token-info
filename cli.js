#!/usr/bin/env node
const { getTokenInfo } = require('./index');

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: eos-token-info <symbol>');
  process.exit(0);
}

console.info(getTokenInfo('EIDOS'));
