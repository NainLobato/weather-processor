import db from '../../core/clients/db';

const getModel = (transaction) => {
  let baseModel = db('cities');

  if (transaction) {
    baseModel = baseModel.transacting(transaction);
  }

  return baseModel;
};

const find = (where, transaction = null) => getModel(transaction)
  .where(where)
  .first();

const findAll = (where, transaction = null) => getModel(transaction)
  .where(where);

const insert = (data, transaction = null) => getModel(transaction)
  .returning('*')
  .insert(data)
  .then(([item]) => item);

const update = (where, data, transaction = null) => getModel(transaction)
  .returning('*')
  .where(where)
  .update(data)
  .update('updated_at', db.fn.now())
  .then(([item]) => item);

export default {
  find,
  findAll,
  insert,
  update,
};
