export interface TokenInfo {
  symbol: string;
  contract: string;
  decimals: number;
  issuer: string;
  maximum_supply: number;
}
/**
 * Get the symbol info.
 *
 * @param symbol The currency symbol, e.g., EIDOS, DICE, KEY, etc.
 * @returns The TokenInfo
 */
export declare function getTokenInfo(symbol: string): TokenInfo;
