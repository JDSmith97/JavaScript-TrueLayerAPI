const { DataAPIClient, API } = require("truelayer-client");
const userDBHandler = require("./../db/user");
const transactionDBHandler = require("./../db/transactions");

const getUserInfo = async function(tokens) {
  const userInfo = await DataAPIClient.getInfo(tokens.access_token);

  const userId = await userDBHandler.checkUserId(userInfo);
  return userId;
}

const getAccounts = async function(tokens) {
  return new Promise(async (resolve, reject) => {
    const accounts = await DataAPIClient.getAccounts(tokens.access_token);
    resolve(accounts);
  })
};

const getAccountID = function(tokens, accounts, userId) {
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
