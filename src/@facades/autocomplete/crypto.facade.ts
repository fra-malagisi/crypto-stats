import coinPaprikaApi from '@services/coin-paprika/coinPaprikaApi';
import { IAutocompleteData } from '@components/@shared/autocomplete/autocomplete.interface';
import { ICoin, ICryptoDetails } from '@models/coinPaprika.models';
import { ICrypto } from '@models/crypto.models';

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
