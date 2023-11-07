//Needed Resources
const express = require("express")
const routerAccount = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Route "My Account" 
routerAccount.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route POST "Register"
routerAccount.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

//Route "Register" 
routerAccount.get("/register", utilities.handleErrors(accountController.buildRegister))



//Route Error
// routerAccount.get("/throwerror");

module.exports = routerAccount
