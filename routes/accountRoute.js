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

// Route to management login
routerAccount.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagementLogin));

// Process the login attempt
routerAccount.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
    utilities.handleErrors(accountController.accountLogin)
  )

//Route "Edit Account" 
routerAccount.get("/update/:account_id", utilities.handleErrors(accountController.buildEditAccount))

//Route POST "Edit Account"
routerAccount.post(
  "/update-account",
  regValidate.updateAccountRules(),
  regValidate.checkInformationData,
  utilities.handleErrors(accountController.updateAccount)
)

//Route POST "Edit Password"
routerAccount.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

//Route "Logout" 
routerAccount.get("/logout", utilities.handleErrors(accountController.logoutAccount))

module.exports = routerAccount
