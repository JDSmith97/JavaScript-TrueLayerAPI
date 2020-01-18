const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const app = require("express")();

const authHandler = require("./auth");

const config = require("config").get("Config");

app.get("/", async (req, res) => {
  await authHandler.handleAuthURL(req, res);
});

app.get("/redirect", async (req, res) => {
  const tokens = await authHandler.getToken(req, res);
  const info = await authHandler.getAccounts(tokens);

  res.set("Content-Type", "text/plain");
  res.send("Info: " + JSON.stringify(info, null, 2));
});

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
