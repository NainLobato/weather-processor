import db from '../../core/clients/db';

const getModel = (transaction) => {
  let baseModel = db('successful_responses');

  if (transaction) {
    baseModel = baseModel.transacting(transaction);
  }

  return baseModel;
};

const insert = (data, transaction = null) => getModel(transaction)
  .returning('*')
  .insert(data)
  .then(([item]) => item);

const findMax = (where, maxToFind, transaction = null) => getModel(transaction)
  .innerJoin('requests', 'requests.id', 'successful_responses.request_id')
  .where(where)
  .max(maxToFind)
  .first();

const findMin = (where, minToFind, transaction = null) => getModel(transaction)
  .innerJoin('requests', 'requests.id', 'successful_responses.request_id')
  .where(where)
  .min(minToFind)
  .first();

const getAvg = (where, avgToFind, transaction = null) => getModel(transaction)
  .innerJoin('requests', 'requests.id', 'successful_responses.request_id')
  .where(where)
  .avg(avgToFind)
  .first();

const findLast = (where, transaction = null) => getModel(transaction)
  .innerJoin('requests', 'requests.id', 'successful_responses.request_id')
  .where(where)
  .orderBy('successful_responses.created_at', 'desc')
  .first();

export default {
  insert,
  findMax,
  findMin,
  getAvg,
  findLast,
};
