const userHandler = require("./user");
const accountHandler = require("./db/accounts");

const runAPIs = function(tokens, debug){
    return new Promise(async (resolve, reject) => {
        try {

            execTimes = [];
            const accounts = await userHandler.getAccounts(tokens);
            execTimes.push("GetAccounts: " + accounts.exec + "ms");

            const userId = await userHandler.getUserInfo(tokens);
            execTimes.push("GetUserInfo: " + userId.exec + "ms");

            const accountId = await userHandler.getAccountID(tokens, accounts.accounts, userId.userId);
            execTimes.push("GetAccountID: " + accountId + "ms");
          
            await accountHandler.insertAccounts(accounts.accounts, userId.userId);

            if(!debug){
                resolve();
            }
            resolve(execTimes);
        }
        catch(error) {
            console.error('Error', error.error);
            resolve(error.error);
        }
    })
}

module.exports = {
    runAPIs
}
  