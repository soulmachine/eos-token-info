# eos-token-info

All EOS tokens information.

## How to use

```javascript
/* eslint-disable import/no-unresolved,no-console */
const { getTokenInfo } = require("eos-token-info");

console.info(getTokenInfo("EIDOS"));
```

## API Manual

There is only one API in this library:

```typescript
/**
 * Get the symbol info.
 *
 * @param symbol The currency symbol, e.g., EIDOS, DICE, KEY, etc.
 * @returns TokenInfo
 */
export function getTokenInfo(symbol: string): TokenInfo;
```

Which returns an `TokenInfo`:

```typescript
export interface TokenInfo {
  symbol: string;
  contract: string;
  decimals: number;
  issuer: string;
  maximum_supply: number;
}
```

## References

- [use getTableRows to get list of all tokens on EOS · Issue #254 · EOSIO/eosjs](https://github.com/EOSIO/eosjs/issues/254)
