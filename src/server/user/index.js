const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const config = require("config").get("Config");

const getAccounts = async function(tokens) {
  const info = await DataAPIClient.getAccounts(tokens.accessToken);
  return info;
};

const getTransactions = async function(tokens, info) {
  const transactions = await DataAPIClient.getTransactions(
    tokens.accessToken,
    "56c7b029e0f8ec5a2334fb0ffc2fface"
  );
  return transactions;
};

module.exports = {
  getAccounts,
  getTransactions
};
