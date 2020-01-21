const fs = require("fs");

const db = require("../../../truelayer/db");
var getUsersAccountsSQL = fs.readFileSync(__dirname + '/sql/getUserAccounts.sql').toString();

const userAccounts = async function(userId) {
    return new Promise((resolve, reject) => {
        db.getConnection( async function(err, conn) {
            if (err) {
              resolve(err);
            }
            const accounts = await queryDB(conn, getUsersAccountsSQL, userId); 

            resolve(accounts);
        })
    })
}

const queryDB = async function(conn, sql, userId){
    return new Promise((resolve) => {
        conn.query(sql, userId, function( err, result ) {
            if (err) {
               resolve(err);
            }
    
            resolve(result);
        });
        conn.release();
    })
}

module.exports = {
    userAccounts
}