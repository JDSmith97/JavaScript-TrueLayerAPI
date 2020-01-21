const { DataAPIClient } = require("truelayer-client");

const userHandler = require("./user");
const accountHandler = require("./db/accounts");

const runAPIs = function(tokens){
    return new Promise(async (resolve, reject) => {
        try {

            console.log(tokens);
            const accounts = await userHandler.getAccounts(tokens);
            const userId = await userHandler.getUserInfo(tokens);
          
            await accountHandler.insertAccounts(accounts, userId);
            await userHandler.getAccountID(tokens, accounts, userId);
            resolve();
        }
        catch(error) {
            console.error('Error',error.error);
            resolve(error.error);
        }
    })

}

module.exports = {
    runAPIs
}
  