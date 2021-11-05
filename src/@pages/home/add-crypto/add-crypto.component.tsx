import { ChangeEvent, useEffect, useState } from 'react';

import { cryptoAutocompleteList } from '@facades/autocomplete';
import faunaDbApi from '@services/fauna-db';

import Autocomplete from '@components/@shared/autocomplete';
import TextField from '@components/@shared/text-field';
import Button from '@components/@shared/button';
import Loader from '@components/@shared/content-loader';

import { IAutocompleteData } from '@types';
import { AddCryptoProps } from '@types';

const AddCrypto = ({ onCryptoAdded }: AddCryptoProps) => {
  const [qty, setQty] = useState<string>('');
  const [cryptoId, setCryptoId] = useState<string>('');
  const [cryptoName, setCryptoName] = useState<string>('');
  const [resetCryptoId, setResetCryptoId] = useState<boolean>(false);
  const [autocompleteData, setAutocompleteData] = useState<IAutocompleteData[]>([]);

  useEffect(() => {
    cryptoAutocompleteList().then((data: IAutocompleteData[]) => setAutocompleteData(data));
  }, []);

  const handleAutocompleteChange = (crypto: string) => {
    const [id, name] = crypto.split(':');
    setCryptoId(id && id.trim());
    setCryptoName(name && name.trim());
  };

  const handleSubmit = async () => {
    await faunaDbApi.saveCrypto({
      id: cryptoId,
      qty: +qty,
      name: cryptoName,
    });
    setResetCryptoId(true);
    setQty('');
    setResetCryptoId(false);
    if (onCryptoAdded) {
      onCryptoAdded();
    }
  };

  return (
    <section>
      <h2 className="font-sans text-2xl mb-8">Add your crypto</h2>
      {autocompleteData.length > 0 ? (
        <form
          className="flex"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mr-4 max-w-xs w-60">
            <Autocomplete
              label="Crypto"
              id="crypto"
              reset={resetCryptoId}
              data={autocompleteData}
              returnText
              onChange={handleAutocompleteChange}
            />
          </div>
          <div className="mr-4 w-32">
            <TextField
              label="Qty"
              id="quantity"
              type="number"
              handleChange={(event: ChangeEvent<HTMLInputElement>) => setQty(event.target.value)}
              value={`${qty}`}
            ></TextField>
          </div>
          <div className="flex flex-col pt-6">
            <Button label="+" type="submit" disabled={!qty || !cryptoId} />
          </div>
        </form>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default AddCrypto;
