const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const config = require("config").get("Config");

const authClient = new AuthAPIClient({
  client_id: config.trueLayer.client_id,
  client_secret: config.trueLayer.client_secret
});

const handleAuthURL = async function(req, res) {
  const authURL = authClient.getAuthUrl({
    redirectURI: config.redirect_uri,
    scope: config.trueLayer.scopes,
    enableMock: "true",
    providerId: config.trueLayer.providerId
  });
  return res.redirect(authURL);
};

const getToken = async function(req, res) {
  const tokens = await authClient.exchangeCodeForToken(
    config.redirect_uri,
    req.query.code
  );
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token
  };
};

const getAccounts = async function(tokens) {
  const info = await DataAPIClient.getAccounts(tokens.accessToken);
  return info;
};

module.exports = {
  handleAuthURL,
  getToken,
  getAccounts
};
