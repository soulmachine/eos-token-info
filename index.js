const assert = require("assert").strict;

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

/** @type {{[key:string]: TokenInfo}} */
const data = require("./tokens.json");

/**
 * Get the symbol info.
 *
 * @param symbol{string} The currency symbol, e.g., EIDOS, DICE, KEY, etc.
 * @returns {TokenInfo} The TokenInfo
 */
// eslint-disable-next-line import/prefer-default-export
function getTokenInfo(symbol) {
  assert.ok(symbol);
  return data[symbol];
}

module.exports = { getTokenInfo };
