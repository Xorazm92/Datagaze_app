exports.up = function (knex) {
  return knex('admin')
    .where({ username: 'Zufar92' })
    .update({
      password: '$2b$10$' + bcrypt.hashSync('12345678', 10)  // Yangi parol: 12345678
    });
};

exports.down = function (knex) {
  return knex('admin')
    .where({ username: 'Zufar92' })
    .update({
      password: '$2b$10$0KM/TmiTpR.RvRXIX1LCOOHTvZV7PSGkdw8MVzEA22GvVLWd.APue'
    });
}; 