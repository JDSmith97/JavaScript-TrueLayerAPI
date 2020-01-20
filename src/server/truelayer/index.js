const { DataAPIClient } = require("truelayer-client");

const authHandler =  require("./auth");
const userHandler = require("./user");
const accountHandler = require("./db/accounts");

const runAPIs = async function(req, res){
  const tokens = await authHandler.getToken(req, res);
  const userData = await DataAPIClient.getInfo(tokens.accessToken);
  const accounts = await userHandler.getAccounts(tokens);
  const userId = await userHandler.getUserInfo(tokens);

  await accountHandler.insertAccounts(accounts, userId);
  await userHandler.getAccountID(tokens, accounts, userId);
}

module.exports = {
    runAPIs
}
  