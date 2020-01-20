const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "test",
  database: "truelayer",
  connectionLimit: 10
});

const getConnection = function(callback) {
  pool.getConnection(function(err, connection) {
    callback(err, connection);
  });
};

module.exports = {
  getConnection
};
