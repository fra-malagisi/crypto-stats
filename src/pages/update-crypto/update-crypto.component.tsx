import { useFormik } from 'formik';
import TextField from 'components/shared/text-field';
import { UpdateCryptoProps } from 'types';
import Button from 'components/shared/button';
import RefreshIcon from 'icons/refresh.icon';

interface Values {
  name: string;
  qty: number;
}

const UpdateCrypto = ({ crypto }: UpdateCryptoProps): JSX.Element => {
  const formik = useFormik({
    initialValues: {
      name: crypto.name,
      qty: crypto.qty,
    },
    onSubmit: (values: Values) => console.log(values),
  });
  return (
    <form className="flex" onSubmit={formik.handleSubmit}>
      <div className="mr-4 max-w-xs w-60">
        <TextField name="name" id="name" label="Name:" onChange={formik.handleChange} value={formik.values.name} disabled />
      </div>
      <div className="mr-4 w-32">
        <TextField name="qty" id="qty" label="Qty:" type="number" onChange={formik.handleChange} value={formik.values.qty.toString()} />
      </div>
      <div className="flex flex-col pt-6">
        <Button icon={<RefreshIcon />} type="submit" disabled={!formik.values.qty} />
      </div>
    </form>
  );
};

export default UpdateCrypto;
