const DEFAULT_OUTPUTS_PATH = './outputs';

const {
  OUTPUTS_PATH = DEFAULT_OUTPUTS_PATH,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  QUERY_LOGS,
} = process.env;

export default {
  OUTPUTS_PATH,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  QUERY_LOGS,
};
