const mysql = require("mysql");
const fs = require('fs');

const db = require("./..");
const insertKeySQL = fs.readFileSync(__dirname + '/sql/insertKeys.sql').toString();
const deleteKeySQL = fs.readFileSync(__dirname + '/sql/deleteKeys.sql').toString();
const getKeySQL = fs.readFileSync(__dirname + '/sql/getKeys.sql').toString();

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

    conn.query(deleteKeySQL, function(err, result) {
        if (err) throw err;
    });

    conn.query(insertKeySQL, keyValues, function(err, result) {
        if (err) throw err;
    });
    conn.release();
  });
};

const getKeys = async function() {
    return new Promise(async (resolve, reject) => {
        db.getConnection(function(err, conn) {
            if (err) {
                console.error("Error connecting: " + err.stack);
                resolve(err);
            }
            conn.query(getKeySQL, function(err, result) {
                if (err) {
                    resolve(err);
                }
                const token = result[0];
                resolve(token);
            });
            conn.release();
        });
        
    });    
};

module.exports = {
    insertKeys,
    getKeys
};
