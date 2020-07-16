const mongoose = require('mongoose');
const dotenv = require('dotenv');
const transactionModel = require('./TransactionModel.js');
dotenv.config();
const { DB_CONNECTION } = process.env;
const db = {};

db.mongoose = mongoose;
db.url = DB_CONNECTION;
db.model = transactionModel;

module.exports = { db };
