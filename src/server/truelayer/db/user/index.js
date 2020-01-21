const { uuid }  = require("uuidv4");
const fs = require('fs');

const db = require("..");
var checkUserSQL = fs.readFileSync(__dirname + '/sql/checkUser.sql').toString();
var addUserSQL = fs.readFileSync(__dirname + '/sql/addUser.sql').toString();

var userDetails = [];

const checkUserId = async function(userInfo) {
    const userEmail = userInfo.results[0].emails[0];

    return new Promise((resolve, reject) => {
        db.getConnection( async function(err, conn) {
            if (err) {
              reject(err);
            }
            const userId = await queryDB(conn, userEmail, userInfo); 

            resolve(userId);
        })
    })
}

const queryDB = async function(conn, userEmail, userInfo){
    let userId;
    return new Promise((resolve) => {
        conn.query(checkUserSQL, userEmail, function( err, result ) {
            if (err) {
               resolve(err);
            }
    
            if(!result.length){
                userDetails = {
                    user_id: uuid(),
                    name: userInfo.results[0].full_name,
                    email: userEmail
                }
                conn.query(addUserSQL, userDetails, function( err ) {
                    if (err) throw err;
                });
                userId = userDetails.user_id;
                resolve(userId);
            } else{
                userId = result[0].user_id;
                resolve(userId);
            }
        });
        conn.release();
    })
}

module.exports = {
    checkUserId
}