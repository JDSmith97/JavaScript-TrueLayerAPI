const mysql = require("mysql");
const fs = require('fs');

const db = require("./..");
var accountSQL = fs.readFileSync(__dirname + '/sql/createAccount.sql').toString();

var accountValues = [];

const insertAccounts = async function(accounts) {
  db.getConnection(function(err, conn) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
    console.log("Connected as id " + conn.threadId);

    accounts.results.forEach(account => {
      accountValues = {
        update_timestamp: account.update_timestamp,
        account_id: account.account_id,
        account_type: account.account_type,
        display_name: account.display_name,
        currency: account.currency,
        account_swift_no: account.account_number.swift_bic,
        account_no: account.account_number.number,
        account_sort_code: account.account_number.sort_code,
        provider_name: account.provider.display_name,
        provider_id: account.provider.provider_id
      };

      conn.query(accountSQL, [accountValues, accountValues], function(err, result) {
        if (err) throw err;
      });
      accountValues = [];
    });
  });
};

module.exports = {
  insertAccounts
};
