const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const skillRouter = require('./routers/skill');

const app = express();

const PORT = 8080;
const HOST_NAME = 'localhost';
const DATABASE_NAME = 'Database';

require("dotenv").config();

mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/skills', skillRouter);

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});
