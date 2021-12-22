import { client, q } from 'config/db';
import { DailyAmount } from 'types';

const DAILY_AMOUNT_COLLECTION = 'daily_amount';

const getAllDailyAmounts = async (): Promise<DailyAmount[]> =>
  await client
    .query(q.Map(q.Paginate(q.Documents(q.Collection(DAILY_AMOUNT_COLLECTION))), q.Lambda('X', q.Get(q.Var('X')))))
    .then((response: any) =>
      response['data'].map((data: any) => ({
        ref: data.ref.id,
        ...data.data,
      }))
    );

const saveDailyAmounts = async (dailyAmount: DailyAmount) =>
  await client.query(
    q.Create(q.Collection(DAILY_AMOUNT_COLLECTION), {
      data: dailyAmount,
    })
  );

const updateDailyAmount = async (dailyAmount: DailyAmount) =>
  await client.query(
    q.Update(q.Ref(q.Collection(DAILY_AMOUNT_COLLECTION), dailyAmount.ref), {
      data: {
        ...dailyAmount,
      },
    })
  );

export const faunaDbApiDailyAmount = {
  getAllDailyAmounts,
  saveDailyAmounts,
  updateDailyAmount,
};
