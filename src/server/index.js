const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const app = require("express")();

const authHandler = require("./auth");
const userHandler = require("./user");
const accountHandler = require("./db/accounts");
const transactionHandler = require("./db/transactions");

const config = require("config").get("Config");

app.get("/", async (req, res) => {
  await authHandler.handleAuthURL(req, res);
});

app.get("/redirect", async (req, res) => {
  const tokens = await authHandler.getToken(req, res);
  const accounts = await userHandler.getAccounts(tokens);

  await accountHandler.insertAccounts(accounts);
  await userHandler.getAccountID(tokens, accounts);

  res.set("Content-Type", "text/plain");
  res.send("Info: " + JSON.stringify(accounts, null, 2));
});

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
