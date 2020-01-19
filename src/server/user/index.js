const { DataAPIClient } = require("truelayer-client");
const userDBHandler = require("./../db/user");
const transactionDBHandler = require("./../db/transactions");

const getUserInfo = async function(tokens) {
  const userInfo = await DataAPIClient.getInfo(tokens.accessToken);

  const userId = await userDBHandler.checkUserId(userInfo);
  console.log('test',userId);
  return userId;
}

const getAccounts = async function(tokens) {
  const accounts = await DataAPIClient.getAccounts(tokens.accessToken);
  return accounts;
};

const getAccountID = function(tokens, accounts, userId) {
  accounts.results.forEach(async account => {
    const transactions = await DataAPIClient.getTransactions(
      tokens.accessToken,
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
    tokens.accessToken,
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
