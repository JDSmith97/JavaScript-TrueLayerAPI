const fs = require('fs');
const mysql = require('mysql');

const getUserAccounts =  require("./getUserAccounts");
const db = require("../../truelayer/db");
var getAccountTableSQL = fs.readFileSync(__dirname + '/sql/getAccountTable.sql').toString();

const getTransactions = async function(userId){
    var userTransactions = [];
    const accounts = await getAccounts(userId);

    return new Promise((resolve, reject) => {
        db.getConnection( async function(err, conn) {
            if (err) {
              reject(err);
            }
            accounts.forEach(async account => {

                var getAccountSQL = mysql.format(getAccountTableSQL, account.account_id);
                getAccountSQL = getAccountSQL.replace(/["']/g, "");

                const transactions = await dbQuery(getAccountSQL, account.account_id, userId, conn);

                var accountTransactions = {
                    ['Account: ' + account.account_id] : {
                        transactions
                    }
                }
                userTransactions.push(accountTransactions);
                if(userTransactions.length  === accounts.length) {
                    resolve(userTransactions);
                }
            }); 
            conn.release();           
        });
    });
};

const dbQuery = async function(sql, accountId, userId, conn) {
    return new Promise((resolve) => {
        conn.query(sql, userId, function( err, result ) {
            if (err) {
               resolve(err);
            }
    
            resolve(JSON.parse(JSON.stringify(result)));
        });
    })
}

const getAccounts = async function(userId) {
    const accounts = await getUserAccounts.userAccounts(userId);
    return accounts;
};

module.exports = {
    getTransactions
};