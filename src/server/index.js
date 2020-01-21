const bodyParser = require("body-parser");
const app = require("express")();

const truelayerAPI = require("./truelayer/index");
const authHandler = require("./truelayer/auth");
const apiHandler = require("./api/index");
const keyHandler = require("./truelayer/db/keys");

const config = require("config").get("Config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  await authHandler.handleAuthURL(req, res);
});

app.get("/redirect", async (req, res) => {

  const tokens = await authHandler.recieveToken(req, res);
  const api = await truelayerAPI.runAPIs(tokens);

  if(!api){
    return res.status(200).send("Accounts synced")
  }
  return res.status(400).send("An error occurred")
});

app.get("/api/get-transactions", async (req, res) => {
  if(!req.query.userId) {
    return res.status(400).send({
      success: 'false',
      message: 'UserId is required'
    })
  }
  const transactions = await apiHandler.getTransactions(req.query.userId);

  res.status(200).send({
    success: 'true',
    message: 'Transactions retrieved successfully',
    transactions: transactions
  })
})

app.get("/api/get-transactions-debug", async (req, res) => {

  const tokens = await keyHandler.getKeys();
  console.log(tokens)
  const transactions = await apiHandler.getTransactions(tokens);

  res.status(200).send({
    success: 'true',
    message: 'Transactions retrieved successfully',
    transactions: transactions
  })
})

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
