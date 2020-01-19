const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const config = require("config").get("Config");
const transactionHandler = require("./../db/transactions");

const getAccounts = async function(tokens) {
  const accounts = await DataAPIClient.getAccounts(tokens.accessToken);
  return accounts;
};

const getAccountID = function(tokens, accounts) {
  accounts.results.forEach(async account => {
    const transactions = await DataAPIClient.getTransactions(
      tokens.accessToken,
      account.account_id
    );
    await transactionHandler.insertTransactions(
      transactions,
      account.account_id
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
  getAccounts,
  getAccountID,
  getTransactions
};
