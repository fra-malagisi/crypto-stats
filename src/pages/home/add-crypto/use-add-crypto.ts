import { useEffect, useState } from 'react';
import faunaDbApi from 'services/fauna-db';
import { cryptoAutocompleteList } from 'facades/autocomplete';
import { IAutocompleteData } from 'types';

type UseAddCryptoResult = {
  onCryptoChange: (crypto: string) => void;
  onHandleSubmit: (qty: string, submitCallback: (() => void) | undefined) => void;
  autocompleteData: IAutocompleteData[];
  resetAutocomplete: boolean;
};
const useAddCrypto = (): UseAddCryptoResult => {
  const [cryptoName, setCryptoName] = useState<string>('');
  const [cryptoId, setCryptoId] = useState<string>('');
  const [autocompleteData, setAutocompleteData] = useState<IAutocompleteData[]>([]);
  const [resetAutocomplete, setResetAutocomplete] = useState<boolean>(false);

  useEffect(() => {
    cryptoAutocompleteList().then((data: IAutocompleteData[]) => setAutocompleteData(data));
  }, []);

  const onCryptoChange = (crypto: string) => {
    const [id, name] = crypto.split(':');
    setCryptoId(id && id.trim());
    setCryptoName(name && name.trim());
  };

  const onHandleSubmit = async (qty: string, submitCallback: (() => void) | undefined) => {
    await faunaDbApi.saveCrypto({
      id: cryptoId,
      qty: +qty,
      name: cryptoName,
    });
    if (submitCallback) {
      submitCallback();
    }
    setResetAutocomplete(!resetAutocomplete);
  };

  return {
    onCryptoChange,
    onHandleSubmit,
    autocompleteData,
    resetAutocomplete,
  };
};

export default useAddCrypto;
