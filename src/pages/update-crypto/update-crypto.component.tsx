import { useFormik } from 'formik';
import TextField from 'components/shared/text-field';
import { UpdateCryptoProps } from 'types';
import Button from 'components/shared/button';
import RefreshIcon from 'icons/refresh.icon';
import faunaDbApi from 'services/fauna-db';

interface Values {
  name: string;
  qty: number;
  color: string | undefined;
}

const UpdateCrypto = ({ crypto, action }: UpdateCryptoProps): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      name: crypto.name,
      qty: crypto.qty,
      color: crypto.color,
    },
    onSubmit: async (values: Values) => {
      await faunaDbApi.updateCrypto({ id: crypto.id, qty: values.qty, name: crypto.name, color: values.color, ref: crypto.ref });
      if (action) {
        action();
      }
    },
  });

  return (
    <form className="flex" onSubmit={formik.handleSubmit}>
      <div className="mr-4 max-w-xs w-60">
        <TextField name="name" id="name" label="Name:" onChange={formik.handleChange} value={formik.values.name} disabled />
      </div>
      <div className="mr-4 w-32">
        <TextField name="qty" id="qty" label="Qty:" type="number" onChange={formik.handleChange} value={formik.values.qty.toString()} />
      </div>
      <div className="mr-4 w-32">
        <TextField
          name="color"
          label="Color"
          id="color"
          type="color"
          onChange={formik.handleChange}
          value={formik.values.color?.toString()}
        ></TextField>
      </div>
      <div className="flex flex-col pt-6">
        <Button icon={<RefreshIcon isBig />} type="submit" disabled={!formik.values.qty} />
      </div>
    </form>
  );
};

export default UpdateCrypto;
