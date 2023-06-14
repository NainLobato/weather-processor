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

export default { insert };
