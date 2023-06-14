exports.up = (knex) => knex.raw(
  `
  INSERT INTO cities (name) VALUES ('ciudad-de-mexico');
  INSERT INTO cities (name) VALUES ('monterrey');
  INSERT INTO cities (name) VALUES ('merida');
  INSERT INTO cities (name) VALUES ('wakanda');
  `,
);

exports.down = (knex) => knex.raw(`TRUNCATE cities RESTART IDENTITY CASCADE;`);
