import { ICrypto } from '../types';
import { multiplication } from './math.util';
import { currencyFormat } from './currency.util';

export const populateCryptoValues = (crypto: ICrypto): ICrypto => {
  const value = parseFloat((crypto.value || 0).toFixed(3));
  const myValue = parseFloat(multiplication(value || 0, crypto.qty).toFixed(3));
  const myValueFormatted = currencyFormat(myValue || 0, '€');
  const valueFormatted = currencyFormat(value || 0, '€');
  return { ...crypto, value, myValue, myValueFormatted, valueFormatted };
};
