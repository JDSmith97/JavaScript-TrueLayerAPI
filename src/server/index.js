const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const app = require("express")();

const authHandler = require("./auth");
const userHandler = require("./user");
const accountHandler = require("./db/accounts");

const config = require("config").get("Config");

app.get("/", async (req, res) => {
  await authHandler.handleAuthURL(req, res);
});

app.get("/redirect", async (req, res) => {
  const tokens = await authHandler.getToken(req, res);
  const info = await userHandler.getAccounts(tokens);
  const transactions = await userHandler.getTransactions(tokens, info);

  await accountHandler.insertAccounts(info);

  res.set("Content-Type", "text/plain");
  res.send("Info: " + JSON.stringify(info, null, 2));
});

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
