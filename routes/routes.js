const express = require('express');
const transactionRouter = express.Router();

const controller = require('../services/transactionService.js');

transactionRouter.post('/', controller.insertTransaction);
transactionRouter.get('/', controller.getAllTransactions);
transactionRouter.get('/:id', controller.getTransactionById);
transactionRouter.put('/:id', controller.updateTransaction);
transactionRouter.delete('/:id', controller.deleteTransaction);
transactionRouter.delete('/', controller.deleteAllTransactions);

module.exports = transactionRouter;
