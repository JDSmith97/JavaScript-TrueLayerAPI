const mysql = require("mysql");

const db = require("./..");

var accountValues = [];

const insertAccounts = async function(accounts) {
  db.getConnection(function(err, conn) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
    console.log("Connected as id " + conn.threadId);

    accounts.results.forEach(obj => {
      accountValues = {
        update_timestamp: obj.update_timestamp,
        account_id: obj.account_id,
        account_type: obj.account_type,
        display_name: obj.display_name,
        currency: obj.currency,
        account_swift_no: obj.account_number.swift_bic,
        account_no: obj.account_number.number,
        account_sort_code: obj.account_number.sort_code,
        provider_name: obj.provider.display_name,
        provider_id: obj.provider.provider_id
      };

      conn.query("INSERT INTO `accounts` SET ?", accountValues, function(
        err,
        result
      ) {
        if (error) throw error;
      });
      accountValues = [];
    });
  });
};

module.exports = {
  insertAccounts
};
