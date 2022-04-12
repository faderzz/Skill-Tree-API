require('dotenv').config();
const mongoose = require('mongoose');

function load() {
  mongoose.connect(process.env.DB_KEY);//'mongodb://' + HOST_NAME + '/' + DATABASE_NAME
  mongoose.connection.on('connect', () => console.log('MongoDB connected'));
}

module.exports = load;
