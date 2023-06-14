exports.up = (knex) => knex.schema.createTable('successful_responses', (table) => {
  table.bigIncrements('id').primary();
  table.bigInteger('request_id').notNullable().index();
  table.string('distance');
  table.float('humidity');
  table.integer('temperature');
  table.dateTime('update_date');
  table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());

  table.foreign('request_id').references('id').inTable('requests');
});

exports.down = (knex) => knex.schema.dropTableIfExists('successful_responses');
