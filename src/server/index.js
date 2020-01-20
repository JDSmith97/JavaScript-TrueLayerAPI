const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const bodyParser = require("body-parser");
const app = require("express")();

const authHandler = require("./auth");
const userHandler = require("./user");
const accountHandler = require("./db/accounts");
const apiHandler = require("./api/index");

const config = require("config").get("Config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get("/api/get-transactions", async (req, res) => {
  if(!req.query.userId) {
    return res.status(400).send({
      success: 'false',
      message: 'UserId is required'
    })
  }
  const transactions = await apiHandler.getTransactions(req.query.userId);

  // console.log(transactions);
  res.status(200).send({
    success: 'true',
    message: 'Transactions retrieved successfully',
    transactions: transactions
  })
})

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
