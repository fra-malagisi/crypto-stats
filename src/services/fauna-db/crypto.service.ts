import { client, q } from 'config/db';
import { ICrypto } from 'types';

const CRYPTO_COLLECTION = 'crypto';

const getAllCoins = async (): Promise<ICrypto[]> =>
  await client
    .query(q.Map(q.Paginate(q.Documents(q.Collection(CRYPTO_COLLECTION))), q.Lambda('X', q.Get(q.Var('X')))))
    .then((response: any) =>
      response['data'].map((data: any) => ({
        ref: data.ref.id,
        ...data.data,
      }))
    );

const saveCrypto = async (crypto: ICrypto) =>
  await client.query(
    q.Create(q.Collection(CRYPTO_COLLECTION), {
      data: crypto,
    })
  );

const updateCrypto = async (crypto: ICrypto) =>
  await client.query(
    q.Update(q.Ref(q.Collection('crypto'), crypto.ref), {
      data: {
        ...crypto,
      },
    })
  );

const getCryptoById = async (id: string) => await client.query(q.Get(q.Ref(q.Collection('crypto'), id)));

const deleteCrypto = async (cryptoRef: string) => await client.query(q.Delete(q.Ref(q.Collection(CRYPTO_COLLECTION), cryptoRef)));

export const faunaDbApiCrypto = {
  getAllCoins,
  saveCrypto,
  getCryptoById,
  deleteCrypto,
  updateCrypto,
};
