const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 2 })
        .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) //Convert the first letter to uppercase and the last letter to lowercase
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) //Convert the first letter to uppercase and the last letter to lowercase
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {
        const account_id = req.body.account_id
        const account = await accountModel.getAccountById(account_id)
        // Check if submitted email is same as existing
        if (account_email != account.account_email) {
        // No - Check if email exists in table
          const emailExists = await accountModel.checkExistingEmail(account_email)
         // Yes - throw error
        if (emailExists != 0) {
        throw new Error("Email exists. Please use a different email")
      }
    }
 }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists) {
        throw new Error ("Email doesn't exists. Please register.")
      }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    
    // Compare the password provided with the password stored in the database
    body("account_password")
      .custom(async (account_password, { req }) => {
        const { account_email } = req.body;
        const isPasswordCorrect = await accountModel.checkPassword(account_email, account_password);

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password.");
        }

        return true;
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or 
 * continue to update password
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id, account_password} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/edit-account", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_password
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or 
 * continue to update account information
 * ***************************** */
validate.checkInformationData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/edit-account", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
    return
  }
  next()
}

/*  **********************************
 *  Update Password Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/*  **********************************
 *  Update Account Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
        // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 2 })
      .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) //Convert the first letter to uppercase and the last letter to lowercase
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) //Convert the first letter to uppercase and the last letter to lowercase
      .withMessage("Please provide a last name."), // on error this message is sent.

    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .custom(async (account_email, {req}) => {
      const account_id = req.body.account_id
      const account = await accountModel.getAccountById(account_id)
      // Check if submitted email is same as existing
      if (account_email != account.account_email) {
      // No - Check if email exists in table
        const updateEmail = await accountModel.updateAccountInformation(account_email)      
  }
}),
  ]
} 
  
  module.exports = validate