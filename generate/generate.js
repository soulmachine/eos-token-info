#!/usr/bin/env node
const getExchangeInfo = require('exchange-info').default;
const fs = require('fs');
const assert = require('assert').strict;
const axios = require('axios').default;
const https = require('https');

const EOS_API_ENDPOINTS = [
  'http://api.main.alohaeos.com',
  'http://eos.eoscafeblock.com',
  'http://eos.infstones.io',
  'http://peer1.eoshuobipool.com:8181',
  'http://peer2.eoshuobipool.com:8181',
  'https://api.main.alohaeos.com',
  'https://api.redpacketeos.com',
  'https://api.zbeos.com',
  'https://bp.whaleex.com',
  'https://eos.eoscafeblock.com',
  'https://eos.infstones.io',
  'https://node.betdice.one',
  'https://node1.zbeos.com',
];

/**
 * Token Information.
 *
 * @typedef {Object} TokenInfo
 * @property {string} symbol
 * @property {string} contract
 * @property {number} decimals
 * @property {string} issuer
 * @property {number} maximum_supply
 */

/**
 * @param {string} url
 * @param {{ [key: string]: any }} data
 * @returns {Promise<any>}
 */
async function post(url, data) {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const response = await axios.post(url, data, {
    httpsAgent: agent,
    timeout: 5000, // 5 seconds
  });
  if (
    response.status !== 200 ||
    response.statusText !== 'OK' ||
    !response.headers['content-type'].startsWith('application/json')
  ) {
    throw new Error('Malformed response');
  }
  return response.data;
}

/**
 * @param {string} code
 * @param {string} symbol
 * @returns {Promise<{ supply: string; max_supply: string; issuer: string }>}
 */
async function getCurrencyStats(code, symbol) {
  /** @type {Error | undefined} */
  let error;
  for (let i = 0; i < 3; i += 1) {
    try {
      const apiEndpoint = EOS_API_ENDPOINTS[Math.floor(Math.random() * EOS_API_ENDPOINTS.length)];

      // eslint-disable-next-line no-await-in-loop
      const response = await post(`${apiEndpoint}/v1/chain/get_currency_stats`, { code, symbol });

      return response[symbol];
    } catch (e) {
      error = e;
    }
  }
  console.error(error);
  throw error;
}

/**
 * @param {import('exchange-info').ExchangeInfo} exchangeInfo
 * @param {{ [key: string]: TokenInfo }} tokenInfoMap
 * @returns {Promise<void>}
 */
async function addToken(exchangeInfo, tokenInfoMap) {
  const pairs = Object.keys(exchangeInfo.pairs).filter(x => x.endsWith('_EOS'));
  console.info(pairs);
  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const pairInfo = exchangeInfo.pairs[pair];
    const symbol = pair.split('_')[0];

    const { base_contract: contract, base_precision: decimals } = pairInfo;
    if (symbol in tokenInfoMap) {
      const existingTokenInfo = tokenInfoMap[symbol];
      if (contract !== existingTokenInfo.contract || decimals !== existingTokenInfo.decimals) {
        console.error(existingTokenInfo);
        console.error(contract);
        console.error(decimals);
      }
    } else {
      // @ts-ignore
      const stats = await getCurrencyStats(contract, symbol); // eslint-disable-line no-await-in-loop
      const calcDecimals = (/** @type {string} */ supply) => {
        if (!supply.includes('.')) return 0;
        return supply.split(' ')[0].split('.')[1].length;
      };
      assert.equal(decimals, calcDecimals(stats.supply));
      /** @type {TokenInfo} */
      const tokenInfo = {
        symbol,
        // @ts-ignore
        contract,
        decimals,
        issuer: stats.issuer,
        maximum_supply: parseFloat(stats.max_supply.split(' ')[0]),
        // supply: parseFloat(stats.supply.split(' ')[0]),
      };
      tokenInfoMap[symbol] = tokenInfo; // eslint-disable-line no-param-reassign
    }
  }
}

// sort object keys and stringify.
function stringifyOrder(/** @type {{ [key: string]: any }} */ obj) {
  /** @type {string[]} */
  const allKeys = [];
  JSON.stringify(obj, (key, value) => {
    allKeys.push(key);
    return value;
  });
  allKeys.sort();
  return JSON.stringify(obj, allKeys, 2);
}

(async () => {
  const whaleex = await getExchangeInfo('WhaleEx');
  const newdex = await getExchangeInfo('Newdex');

  /** @type {{ [key: string]: TokenInfo }} */
  const tokenInfoMap = {};
  await addToken(whaleex, tokenInfoMap);
  await addToken(newdex, tokenInfoMap);

  console.info(tokenInfoMap);

  fs.writeFileSync('../tokens.json', stringifyOrder(tokenInfoMap));
})();
