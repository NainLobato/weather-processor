import env from './config/environment';

const {
  DB_USER: user,
  DB_PASSWORD: password,
  DB_NAME: database,
  DB_HOST: host,
  DB_PORT: port,
} = env;

const client = {
  client: 'postgresql',
  connection: {
    host,
    port,
    database,
    user,
    password,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: ['./schema/migrations'],
    tableName: 'knex_migrations',
  },
};

export default client;
