import { ICrypto } from '../types';
import { multiply } from './math.util';
import { currencyFormat } from './currency.util';

export const populateCryptoValues = (crypto: ICrypto, exchangeRatio: number): ICrypto => {
  crypto.value = parseFloat(multiply(crypto.value || 0, exchangeRatio).toFixed(3));
  crypto.myValue = parseFloat(multiply(crypto.value || 0, crypto.qty).toFixed(3));
  crypto.myValueFormatted = currencyFormat(crypto.myValue || 0, '€');
  crypto.valueFormatted = currencyFormat(crypto.value || 0, '€');
  return { ...crypto };
};
