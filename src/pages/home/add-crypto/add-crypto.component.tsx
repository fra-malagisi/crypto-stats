import { useEffect } from 'react';

import Autocomplete from 'components/shared/autocomplete';
import TextField from 'components/shared/text-field';
import Button from 'components/shared/button';
import Loader from 'components/shared/content-loader';

import { IAddCryptoForm } from 'types';
import { AddCryptoProps } from 'types';
import useAddCrypto from './use-add-crypto';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';

const AddCrypto = ({ onCryptoAdded }: AddCryptoProps) => {
  const { autocompleteData, onCryptoChange, onHandleSubmit, resetAutocomplete } = useAddCrypto();

  const { control, handleSubmit, watch, reset } = useForm<IAddCryptoForm>({ defaultValues: { crypto: '', qty: '', color: '' } });

  const onSubmit: SubmitHandler<IAddCryptoForm> = (data) => {
    onHandleSubmit(data.qty, data.color, onCryptoAdded);
    reset();
  };

  const watchCrypto = watch('crypto');
  const watchQty = watch('qty');
  const watchColor = watch('color');

  useEffect(() => {
    if (watchCrypto) {
      onCryptoChange(watchCrypto);
    }
  }, [watchCrypto]);
  useEffect(() => {
    console.log(watchColor);
  }, [watchColor]);

  return (
    <section className="mb-6">
      <h2 className="font-sans text-2xl mb-8">Add your crypto</h2>
      {autocompleteData.length > 0 ? (
        <form className="flex" onSubmit={handleSubmit(onSubmit)}>
          <div className="mr-4 max-w-xs w-60">
            <Controller
              name="crypto"
              control={control}
              defaultValue="''"
              render={({ field: { onChange } }) => (
                <Autocomplete label="Crypto" id="crypto" data={autocompleteData} returnText reset={resetAutocomplete} onChange={onChange} />
              )}
            />
          </div>
          <div className="mr-4 w-32">
            <Controller
              name="qty"
              control={control}
              defaultValue="''"
              render={({ field: { onChange } }) => (
                <TextField name="qty" label="Qty" id="quantity" type="number" onChange={onChange} value={watchQty}></TextField>
              )}
            />
          </div>
          <div className="mr-4 w-32">
            <Controller
              name="color"
              control={control}
              defaultValue="''"
              render={({ field: { onChange } }) => (
                <TextField name="color" label="Color" id="color" type="color" onChange={onChange} value={watchColor}></TextField>
              )}
            />
          </div>
          <div className="flex flex-col pt-6">
            <Button label="+" type="submit" disabled={!watchCrypto || !watchQty} />
          </div>
        </form>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default AddCrypto;
