const bcrypt = require('bcrypt');

exports.up = function (knex) {
  return knex('admin').insert({
    username: 'Zufar92',
    email: 'xorazm92@gmail.com',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'super_admin',
    status: 'active'
  });
};

exports.down = function (knex) {
  return knex('admin').where('username', 'Zufar92').del();
}; 