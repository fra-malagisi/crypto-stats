import { SlowBuffer } from 'buffer';
import coinGeckoApi from 'services/coin-gecko';
import { cryptoPrinceInfo } from 'services/coin-gecko/coin-gecko.service';
import { IAutocompleteData } from 'types';
import { ICoin } from 'types';
import { ICrypto } from 'types';

export const cryptoAutocompleteList = async (): Promise<IAutocompleteData[]> => {
  const fullCryptoList = await coinGeckoApi.coins();
  return await fullCryptoList.map((crypto: ICoin) => ({
    id: crypto.id,
    label: crypto.name,
  }));
};

export const cryptoDetails = async (crypto: ICrypto): Promise<ICrypto> => {
  const cryptoPriceInfo: cryptoPrinceInfo = await coinGeckoApi.getCryptoPrice(crypto.id);
  return { value: cryptoPriceInfo.price, price24Change: parseFloat(cryptoPriceInfo.price24hChange.toFixed(2)), ...crypto };
};
