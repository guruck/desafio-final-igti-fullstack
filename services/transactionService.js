// const mongoose = require('mongoose');
// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
// const TransactionModel = require('../models/TransactionModel');

const { db } = require('../models/index.js');

const ObjectId = db.mongoose.Types.ObjectId;
const TrsModel = db.model;

const insertTransaction = async (req, res) => {
  try {
    const transaction = new TrsModel(req.body);
    await transaction.save();
    res.send(transaction);
    console.log(
      `[INFO]: POST / insertTransaction - ${JSON.stringify(transaction)}`
    );
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    console.log(
      `[ERROR]: POST / insertTransaction - ${JSON.stringify(error.message)}`
    );
  }
};

const getAllTransactions = async (req, res) => {
  const period = req.query.period;
  let regex = /^20[12]\d-0[1-9]$|^20[12]\d-1[0-2]$/i;
  let valido = regex.test(period);
  if (!valido) {
    res.status(400).send({
      error:
        'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm',
    });
    return;
  }

  //condicao para o filtro no findAll
  // var condition = period
  //   ? { period: { $regex: new RegExp(period), $options: 'i' } }
  //   : {};
  var condition = period ? { yearMonth: period } : {};

  try {
    const transaction = await TrsModel.find(condition);

    res.send(transaction);
    console.log(`[INFO]: GET / getAllTransactions`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    console.log(
      `[ERROR]: GET / getAllTransactions - ${JSON.stringify(error.message)}`
    );
  }
};

const getTransactionById = async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await TrsModel.findById({ _id: id });
    res.send(transaction);

    console.log(`[INFO]: GET / getTransactionById - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar a transação id: ' + id });
    console.log(
      `[ERROR]: GET / getTransactionById - ${JSON.stringify(error.message)}`
    );
  }
};

const updateTransaction = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const transaction = await TrsModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    res.send(transaction);

    console.log(
      `[INFO]: PUT / updateTransaction - ${id} - ${JSON.stringify(req.body)}`
    );
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    console.log(
      `[ERROR]: PUT / updateTransaction - ${JSON.stringify(error.message)}`
    );
  }
};

const deleteTransaction = async (req, res) => {
  const id = req.params.id;
  console.log(`[INFO]: DELETE / deleteTransaction - ${id}`);
  try {
    const transaction = await TrsModel.findByIdAndDelete({ _id: id });
    if (!transaction) {
      res.send({ message: `Transaction id ${id} nao encontrado` });
      console.log(`[INFO]: DELETE / deleteTransaction - ${id} nao encontrado`);
    } else {
      res.send({ message: 'Transaction excluido com sucesso' });
      console.log(`[INFO]: DELETE / deleteTransaction - ${id} sucessfuly`);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Transaction id: ' + id });
    console.log(
      `[ERROR]: DELETE / deleteTransaction - ${JSON.stringify(error.message)}`
    );
  }
};

const deleteAllTransactions = async (req, res) => {
  try {
    const transaction = await TrsModel.deleteMany();

    if (transaction.length < 1) {
      res
        .status(404)
        .send({ message: 'Nenhuma transaction encontrado para exclusao' });
      console.log(
        `[INFO]: DELETE / deleteALL - nenhuma transação para ser deletada`
      );
    } else {
      res.send({ message: 'ALLtransactions excluidos com sucesso' });
      console.log(`[INFO]: DELETE / deleteALL - sucessfuly`);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos os transactions' });
    console.log(
      `[ERROR]: DELETE / deleteTransaction - ${JSON.stringify(error.message)}`
    );
  }
};

module.exports = {
  insertTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  deleteAllTransactions,
};
