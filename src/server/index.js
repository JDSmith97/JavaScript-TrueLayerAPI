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
  const userData = await DataAPIClient.getInfo(tokens.accessToken);
  const accounts = await userHandler.getAccounts(tokens);
  
  const userId = await userHandler.getUserInfo(tokens);

  console.log(userId)
  await accountHandler.insertAccounts(accounts, userId);
  await userHandler.getAccountID(tokens, accounts, userId);

  res.set("Content-Type", "text/plain");
  res.send("Info: " + JSON.stringify(userData, null, 2));
});

app.get("/")

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
