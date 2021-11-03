export const currencyFormat = (num: number, symbol: string): string =>
  `${symbol} ${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
