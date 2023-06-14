const THREE = 3;

exports.up = (knex) => knex.schema.createTable('requests', (table) => {
  table.bigIncrements('id').primary();
  table.bigInteger('city_id').notNullable().index();
  table.bigInteger('run_id').notNullable().index();
  table.string('url').notNullable();
  table.integer('response_code');
  table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());

  table.foreign('city_id').references('id').inTable('cities');
});

exports.down = (knex) => knex.schema.dropTableIfExists('requests');
