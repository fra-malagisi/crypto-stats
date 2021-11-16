import exchangeRatioApi from '../services/currencies';
import { useEffect, useState } from 'react';

export const useExchangeRatio = (actualCurrency: string, currencyToConvert: string): number => {
  const [exchangeRatio, setExchangeRatio] = useState(0);

  useEffect(() => {
    console.log('useEffectHook');
    const getExchangeRatios = async () => {
      if (!sessionStorage.getItem('exchangeRatios')) {
        const exchangeRatios = await exchangeRatioApi.getCurrencyExchangeRatios(actualCurrency);
        sessionStorage.setItem('exchangeRatios', JSON.stringify(exchangeRatios));
      }
      setExchangeRatio(JSON.parse(sessionStorage.getItem('exchangeRatios') || '')[actualCurrency][currencyToConvert]);
    };
    getExchangeRatios();
  }, [actualCurrency, currencyToConvert]);

  return exchangeRatio;
};
