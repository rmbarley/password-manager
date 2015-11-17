# password-manager
Simple terminal-based NodeJs password manager

This app was created to learn NodeJS using Andrew Mead's Complete Node Developer Course on Udemy.

password-manager uses two functions: create and get to set and retrieve passwords and their associated accounts. 
The create function requires four commands:
* -n A name for the account (e.g. Twitter, Facebook, or Gmail)
* -u The username for the account
* -p The password for the account
* -m A master password that will be used for all accounts

The get function requires -n and -m.

All information is stored locally using the node-persist module. It is stored securely using the crypto-js module, which encrypts the information using AES. It uses the master password as a key.

Console commands were implemented using the yargs module.
