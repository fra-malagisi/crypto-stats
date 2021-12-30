import coinGeckoApi from 'services/coin-gecko';
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
  const cryptoPrice: number = await coinGeckoApi.getCryptoPrice(crypto.id);
  return { value: cryptoPrice, ...crypto };
};
