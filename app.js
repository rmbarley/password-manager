console.log("Starting password manager");

var crypto = require("crypto-js");
var storage = require("node-persist");
storage.initSync();

var argv = require("yargs")
  .command("create", "Create a new account", function(yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: "n",
        description: "Account name (eg: Twitter, Facebook)",
        type: "string"
      },
      username: {
        demand: true,
        alias: "u",
        description: "Account username or email",
        type: "string"
      },
      password: {
        demand: true,
        alias: "p",
        description: "Account password",
        type: "string"
      },
      masterPassword: {
        demand: true,
        alias: "m",
        description: "A Master Password for your account.",
        type: "string"
        }
    }).help("help");
  })
  .command("get", "Get an existing account", function(yargs) {
    yargs.options({
      name: {
        demand: true,
        alias: "n",
        description: "The name of your account",
        type: "string"
      },
      masterPassword: {
        demand: true,
        alias: "m",
        description: "A Master Password for your account.",
        type: "string"
      }
    }).help("help");
  })
  .help("help")
  .argv;
var command = argv._[0];

function getAccounts(masterPassword) {
  // getItemSync to fetch accounts
  var encryptedAccount = storage.getItemSync("accounts");
  var  accounts = [];

  // decrypt
  if (typeof encryptedAccount !== "undefined") {
    var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
    accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
  }

  // return accounts array
  return accounts;
}

function saveAccounts(accounts, masterPassword) {
  // Encrypt accounts
  var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

  // setitemSync to save encrypted accounts
  storage.setItemSync("accounts", encryptedAccounts.toString());

  // return accounts array
  return accounts;
}

function createAccount(account, masterPassword) {
  var accounts = getAccounts(masterPassword);

  accounts.push(account);
  saveAccounts(accounts, masterPassword);

  return accounts;
}

function getAccount(accountName, masterPassword) {

  var accounts = getAccounts(masterPassword);
  var foundAccount;


  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].name === accountName) {
      foundAccount = accounts[i];
    }
  }
  return foundAccount;
}

// Use create/get with yargs
if(command === "create") {
  try {
    var createdAccount = createAccount({
      name: argv.name,
      username: argv.username,
      password: argv.password
    }, argv.masterPassword);
    console.log("Account created!");
    console.log(createdAccount);
  } catch (e) {
    console.log("Unable to create account");
  }
} else if (command === "get") {
  try {
    var gotAccount = getAccount(argv.name, argv.masterPassword);

    if (typeof gotAccount === "undefined") {
        console.log("Account was not found.");
    } else {
        console.log(gotAccount);
    }
  } catch (e) {
    console.log("Unable to get account");
  }
}



