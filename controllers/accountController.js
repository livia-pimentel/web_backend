const bcrypt = require("bcryptjs")
const utilities = require("../utilities/index")
const account_model = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await account_model.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await account_model.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ***************************
 *  Build Management Login view
 * ************************** */
 async function buildManagementLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./account/management-login", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } catch(error) {
    console.error("buildManagementLogin error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
}

/* ****************************************
*  Deliver edit account view
* *************************************** */
async function buildEditAccount(req, res, next) {
  const account_id = req.params.account_id
  let nav = await utilities.getNav()
  const data = await account_model.getAccountById(account_id)
  // console.log("Data from the database: ", data);
  try {
    res.render("./account/edit-account", {
      title: "Edit Account ",
      nav,
      errors: null,
      data
  })
} catch(error) {
  console.error("buildEditAccount error: " + error);
  res.render("errors/error", {
    title: "Server Error",
    message: "There was a server error.",
    nav: await utilities.getNav(),
  });
}
}

/* ****************************************
*  Process Update Account
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {account_id, account_firstname, account_lastname, account_email} = req.body
  try{
    let updateAccountResult;
      updateAccountResult = await account_model.updateAccountWithoutPassword(account_id, account_firstname, account_lastname, account_email);
    if (updateAccountResult) {
      // Assign account data to locations
      res.locals.accountData = updateAccountResult;
      // console.log("data from function: ", res.locals.accountData)
      const accessToken = jwt.sign(res.locals.accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      req.flash("notice", "The account was successfully updated.");
      res.status(201).redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update account failed.");
    res.status(501).redirect("./account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
    });
  }
} catch (error) {
  console.error("Error updateAccount:", error);
  req.flash("notice", "An error occurred during the update.");
  res.status(500).render("./account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}
}

/* ****************************************
*  Process Update Password
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const {account_id, account_password} = req.body
  const updateAccountResult = await account_model.updateAccountPassword(account_id, account_password);
  console.log("Information updateAccountResult: ", updateAccountResult)

  try{
    if (updateAccountResult) {
      const hashedPassword = await bcrypt.hashSync(account_password, 10)
      req.flash("notice", "The password was successfully updated.");
      res.status(201).render("./account/management-login", {
        title: "Account Management",
        nav,
        errors: null,
      });
  } else {
    req.flash("notice", "Sorry, the update account failed.");
    res.status(501).render("./account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
    });
  }
} catch (error) {
  console.error("Error updatePassword:", error);
  req.flash("notice", "An error occurred during the update.");
  res.status(500).render("./account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}
}


/* ****************************************
*  Process Logout Account
* *************************************** */
async function logoutAccount(req, res, next) {
  req.session.destroy(); // Destruir a sessão
  res.clearCookie("jwt"); // Limpar o cookie JWT
  res.redirect("/")
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagementLogin, buildEditAccount, updateAccount, logoutAccount, updatePassword}