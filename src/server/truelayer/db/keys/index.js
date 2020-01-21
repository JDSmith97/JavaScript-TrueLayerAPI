const mysql = require("mysql");
const fs = require('fs');

const db = require("./..");
const insertKeySQL = fs.readFileSync(__dirname + '/sql/insertKeys.sql').toString();
const getKeysSQL = fs.readFileSync(__dirname + '/sql/getKeys.sql').toString();

var keyValues = [];

const insertKeys = async function(accountToken, refreshToken) {
  db.getConnection(function(err, conn) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
    keyValues = {
    access_token: accountToken,
    refresh_token: refreshToken
    };

    conn.query(insertKeySQL, keyValues, function(err, result) {
        if (err) throw err;
        console.log(result);
    });
  });
};

const getKeys = async function() {
    db.getConnection(function(err, conn) {
      if (err) {
        console.error("Error connecting: " + err.stack);
        return;
      }

      conn.query(getKeysSQL, function(err, result) {
          if (err) throw err;
          console.log(result);
      });
    });
  };

module.exports = {
    insertKeys,
    getKeys
};
