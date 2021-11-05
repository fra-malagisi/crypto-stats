import coinPaprikaApi from '@services/coin-paprika';
import { IAutocompleteData } from '@types';
import { ICoin, ICryptoDetails } from '@types';
import { ICrypto } from '@types';

export const cryptoAutocompleteList = async (): Promise<IAutocompleteData[]> => {
  const fullCryptoList = await coinPaprikaApi.coins();
  return await fullCryptoList.map((crypto: ICoin) => ({
    id: crypto.id,
    label: crypto.name,
  }));
};

export const cryptoDetails = async (crypto: ICrypto): Promise<ICrypto> => {
  console.log('facade', crypto);
  const cryptoDetail: ICryptoDetails = await coinPaprikaApi.getCryptoDetails(crypto.id);
  return { value: cryptoDetail.open, ...crypto };
};
