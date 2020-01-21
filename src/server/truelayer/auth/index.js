const { AuthAPIClient } = require("truelayer-client");
const config = require("config").get("Config");

const keyHandler = require("./../db/keys/index");

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

const recieveToken = async function(req, res) {
  const tokens = await authClient.exchangeCodeForToken(
    config.redirect_uri,
    req.query.code
  );
  await insertTokens(tokens.access_token, tokens.refresh_token);
  return tokens;
};

const insertTokens = async function(accessToken, refreshToken){
  await keyHandler.insertKeys(accessToken, refreshToken);
}

const getTokens = async function() {
  const tokens = await keyHandler.getKeys();
  return tokens;
}

module.exports = {
  handleAuthURL,
  recieveToken,
  getTokens
};
