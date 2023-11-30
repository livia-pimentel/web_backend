const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check account by id
 * ********************* */
async function getAccountById(account_id){
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const accountId = await pool.query(sql, [account_id])
    return accountId.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
*  Update Account
* *************************** */
// async function updateAccount(account_id, account_firstname, account_lastname, account_email, account_password){
//   // console.log("Data from accountModel - UpdateAccount: ", account_id, account_firstname, account_lastname, account_email, account_password)
//   try {
//     const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_password = $4 WHERE account_id = $5 RETURNING *";
//     const idAccount = parseInt(account_id);
//     return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password, idAccount])
//   } catch (error) {
//     return error.message
//   }
// }

/* *****************************
 *  Update Account With Password
 * *************************** */
async function updateAccountWithPassword(account_id, account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3";
    
    // Adicione o campo de senha apenas se uma nova senha for fornecida
    if (account_password && account_password.trim() !== '') {
      sql += ", account_password = $4";
    }

    sql += " WHERE account_id = $5 RETURNING *";

    const idAccount = parseInt(account_id);
    
    // Atualize a senha apenas se uma nova senha for fornecida
    const params = account_password ? [account_firstname, account_lastname, account_email, account_password, idAccount] : [account_firstname, account_lastname, account_email, idAccount];

    return await pool.query(sql, params);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *  Update Account Without Password
 * *************************** */
async function updateAccountWithoutPassword(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const idAccount = parseInt(account_id);
    return await pool.query(sql, [account_firstname, account_lastname, account_email, idAccount]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountById, getAccountByEmail, updateAccountWithoutPassword, updateAccountWithPassword }