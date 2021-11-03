import { client, q } from 'config/db';
import { ICrypto } from '@models/crypto.models';

const CRYPTO_COLLECTION = 'crypto';

export const getAllCoins = async (): Promise<ICrypto[]> =>
  await client
    .query(q.Map(q.Paginate(q.Documents(q.Collection(CRYPTO_COLLECTION))), q.Lambda('X', q.Get(q.Var('X')))))
    .then((response: any) =>
      response['data'].map((data: any) => ({
        ref: data.ref.id,
        ...data.data,
      }))
    );

export const saveCrypto = async (crypto: ICrypto) =>
  await client.query(
    q.Create(q.Collection(CRYPTO_COLLECTION), {
      data: crypto,
    })
  );

export const getCryptoById = async (id: string) => await client.query(q.Get(q.Ref(q.Collection('crypto'), id)));

export const deleteCrypto = async (cryptoRef: string) => await client.query(q.Delete(q.Ref(q.Collection(CRYPTO_COLLECTION), cryptoRef)));
