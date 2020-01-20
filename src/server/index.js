const bodyParser = require("body-parser");
const app = require("express")();

const truelayerAPI = require("./truelayer/index");
const authHandler = require("./truelayer/auth");
const apiHandler = require("./api/index");

const config = require("config").get("Config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  await authHandler.handleAuthURL(req, res);
});

app.get("/redirect", async (req, res) => {

  await truelayerAPI.runAPIs(req,res);

  res.set("Content-Type", "text/plain");
  res.send("Account synced");
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

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
