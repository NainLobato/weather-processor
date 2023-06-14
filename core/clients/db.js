import knex from 'knex';
import client from '../../knexfile';
import env from '../../config/environment';

const { QUERY_LOGS } = env;

const db = knex(client);

db.on('query', (queryData) => {
  if (QUERY_LOGS === 'true') {
    console.log('QUERY LOG', {
      sql: queryData.sql,
      bindings: queryData.bindings,
    });
  }
});

export default db;
