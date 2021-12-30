import { client, q } from 'config/db';
import { DailyAmount } from 'types';

const DAILY_AMOUNT_COLLECTION = 'daily_amount';

const getAllDailyAmounts = async (): Promise<DailyAmount[]> => {
  const date = new Date();
  const monthYear = `${date.getDate() !== 1 ? date.getMonth() + 1 : date.getMonth()}/${
    date.getDate() === 1 && date.getMonth() === 1 ? date.getFullYear() - 1 : date.getFullYear()
  }`;
  return await client
    .query(
      q.Map(
        q.Filter(
          q.Paginate(q.Match(q.Index('all_daily_amount'))),
          q.Lambda('daily_amount', q.ContainsStr(q.Select('dateLabel', q.Select('data', q.Get(q.Var('daily_amount')))), monthYear))
        ),
        q.Lambda('X', q.Get(q.Var('X')))
      )
    )
    .then((response: any) =>
      response['data'].map((data: any) => ({
        ref: data.ref.id,
        ...data.data,
      }))
    );
};

const saveDailyAmounts = async (dailyAmount: DailyAmount) => {
  const dateArr = dailyAmount.dateLabel.split('/');
  const date = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
  return await client.query(
    q.Create(q.Collection(DAILY_AMOUNT_COLLECTION), {
      data: {
        ...dailyAmount,
        date: q.Date(date),
      },
    })
  );
};

const updateDailyAmount = async (dailyAmount: DailyAmount) =>
  await client.query(
    q.Update(q.Ref(q.Collection(DAILY_AMOUNT_COLLECTION), dailyAmount.ref), {
      data: {
        ...dailyAmount,
      },
    })
  );

const deleteDailyAmount = async (dailyAmountRef: string) =>
  await client.query(q.Delete(q.Ref(q.Collection(DAILY_AMOUNT_COLLECTION), dailyAmountRef)));

export const faunaDbApiDailyAmount = {
  getAllDailyAmounts,
  saveDailyAmounts,
  updateDailyAmount,
  deleteDailyAmount,
};
