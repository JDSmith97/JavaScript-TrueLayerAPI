const getUserAccounts = require("./getTransactions/index");

const getTransactions = async function(userId){
    const accounts = getUserAccounts.getTransactions(userId);
    return accounts;
}

module.exports = {
    getTransactions
}