exports.up = async function (knex) {
  await knex.schema.createTable("zoos", (table) => {
    table.increments("id");
    table.text("name").notNull();
    table.text("address").notNull().unique();
  });
  await knex.schema.createTable("species", (table) => {
    table.increments("id");
    table.text("name").notNull().unique();
  });
  await knex.schema.createTable("animals", (table) => {
    table.increments("id");
    table.text("name").notNull();
    //  Creates foreign key
    table
      .integer("species_id")
      .references("id")
      .inTable("species")
      .onDelete("SET NULL");
  });
  await knex.schema.createTable("zoos_animals", (table) => {
    table
      .integer("zoo_id")
      .notNull()
      .references("id")
      .inTable("zoos")
      .onDelete("CASCADE");
    table
      .integer("animal_id")
      .notNull()
      .references("id")
      .inTable("animals")
      .onDelete("CASCADE");
    // knex.raw will pass 'current_timestamp' without quotes, meaning it's
    // an internal sql variable and not a literal string
    table.date("from_date").notNull().defaultTo(knex.raw("current_timestamp"));
    table.date("to_date");
    // Since this table doesn't need aan ID column, we can make the
    // primary key a combination of two columns rather than a single one
    table.primary(["zoo_id", "animal_id"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("zoos_animals");
  await knex.schema.dropTableIfExists("animals");
  await knex.schema.dropTableIfExists("species");
  await knex.schema.dropTableIfExists("zoos");
};
