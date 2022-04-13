const mongoose = require('mongoose');

const HOST_NAME = 'localhost';
const DATABASE_NAME = 'Database';

function load() {
  mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);
  mongoose.connection.on('connect', () => console.log('MongoDB connected'));
}

module.exports = load;
