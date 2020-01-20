const mysql = require("mysql");
const fs = require('fs');

const db = require("..");
var tableSQL = fs.readFileSync(__dirname + '/sql/createTable.sql').toString();
var transactionSQL = fs.readFileSync(__dirname + '/sql/insertTransaction.sql').toString();

var transactionValues = [];

const insertTransactions = async function(transactions, accountNumber, userId) {
  db.getConnection(function(err, conn) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }

    var createTable = mysql.format(tableSQL, accountNumber);
    createTable = createTable.replace(/["']/g, "");

    conn.query(createTable, function( err, result ) {
      if (err) throw err;
    });

    transactions.results.forEach(transaction => {
      transactionValues = {
        user_id: userId,
        timestamp: transaction.timestamp,
        description: transaction.description,
        transaction_type: transaction.transaction_type,
        transaction_category: transaction.transaction_category,
        transaction_classification: JSON.stringify(transaction.transaction_classification),
        amount: transaction.amount,
        currency: transaction.currency,
        transaction_id: transaction.transaction_id,
        balance_currency: transaction.running_balance.currency,
        balance_amount: transaction.running_balance.amount,
        provider_transaction_category: transaction.meta.provider_transaction_category,
      };

      var insertTransaction = mysql.format(transactionSQL, accountNumber);
      insertTransaction = insertTransaction.replace(/[']/g, "`");

      conn.query(insertTransaction, [transactionValues, transactionValues], function(err, result) {
        if (err) throw err;
      });

      transactionValues = [];
    });
    console.log(accountNumber, " transactions inserted")
  });
};

module.exports = {
  insertTransactions
};
