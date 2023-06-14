const FIFTY = 50;

exports.up = (knex) => knex.schema.createTable('cities', (table) => {
  table.bigIncrements('id').primary();
  table.string('name', FIFTY).notNullable();
  table.timestamp('created_at').defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('cities');
