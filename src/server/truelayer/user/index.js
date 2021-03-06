const { DataAPIClient } = require("truelayer-client");
const moment = require("moment");

const userDBHandler = require("./../db/user");
const transactionDBHandler = require("./../db/transactions");

const getUserInfo = async function(tokens) {
  let startTime, endTime;

  startTime = moment().format('x');
  const userInfo = await DataAPIClient.getInfo(tokens.access_token);
  
  const userId = await userDBHandler.checkUserId(userInfo);
  endTime = moment().format('x');
  const timeDiff = endTime - startTime;
  
  return({
    userId: userId,
    exec: timeDiff
  }); 
}

const getAccounts = async function(tokens) {

  return new Promise(async (resolve, reject) => {
    startTime = moment().format('x');
    const accounts = await DataAPIClient.getAccounts(tokens.access_token);
    endTime = moment().format('x');
    const timeDiff = endTime - startTime;
    resolve({
      accounts: accounts,
      exec: timeDiff
    });
  })
};

const getAccountID = function(tokens, accounts, userId) {
  startTime = moment().format('x');
  accounts.results.forEach(async account => {
    const transactions = await DataAPIClient.getTransactions(
      tokens.access_token,
      account.account_id
    );
    await transactionDBHandler.insertTransactions(
      transactions,
      account.account_id,
      userId
    );
  });
  endTime = moment().format('x');
  const timeDiff = endTime - startTime;
  return(timeDiff);
};

const getTransactions = async function(tokens, account) {
  const transactions = await DataAPIClient.getTransactions(
    tokens.access_token,
    account
  );
  return transactions;
};

module.exports = {
  getUserInfo,
  getAccounts,
  getAccountID,
  getTransactions
};
