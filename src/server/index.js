const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const app = require("express")();

const config = require("config").get("Config");

const authClient = new AuthAPIClient({
  client_id: config.trueLayer.client_id,
  client_secret: config.trueLayer.client_secret
});

app.get("/", (req, res) => {
  const authURL = authClient.getAuthUrl({
    redirectURI: config.redirect_uri,
    scope: config.trueLayer.scopes,
    enableMock: "true",
    providerId: config.trueLayer.providerId
  });
  res.redirect(authURL);
});

app.get("/redirect", async (req, res) => {
  const code = req.query.code;
  const tokens = await authClient.exchangeCodeForToken(
    config.redirect_uri,
    code
  );
  console.log("Tokens", tokens);

  const info = await DataAPIClient.getAccounts(tokens.access_token);

  res.set("Content-Type", "text/plain");
  res.send("Info: " + JSON.stringify(info, null, 2));
});

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}...`)
);
