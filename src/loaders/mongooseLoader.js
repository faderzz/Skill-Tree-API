const mongoose = require('mongoose');

function load() {
  mongoose.connect('mongodb://' + process.env.HOST_NAME + '/' + process.env.DATABASE_NAME);
  mongoose.connection.on('connect', () => console.log('MongoDB connected'));
}

module.exports = load;
