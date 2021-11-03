import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNADB_KEY,
  domain: 'db.eu.fauna.com',
});
const q = faunadb.query;

export { client, q };
