const pool = require("../database/")
const bcrypt = require("bcryptjs")

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
 *   Check for existing password
 * ********************* */
async function checkPassword(account_email, account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);

    if (result.rowCount === 1) {
      const storedPassword = result.rows[0].account_password;

      // Compare a senha fornecida com a senha armazenada no banco de dados
      const isPasswordCorrect = await bcrypt.compare(account_password, storedPassword);

      return isPasswordCorrect;
    }

    return false; // Se o e-mail não existe
  } catch (error) {
    throw new Error(error.message);
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
 *  Update Account Password
 * *************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const idAccount = parseInt(account_id);
    const answer = await pool.query(sql, [account_password, account_id]);
    // console.log("Database answer password: ", answer)
    return answer
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *  Update Account Without Password
 * *************************** */
async function updateAccountInformation(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const idAccount = parseInt(account_id);
    const answer = await pool.query(sql, [account_firstname, account_lastname, account_email, idAccount]);
    return answer.rows[0]
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountById, getAccountByEmail, updateAccountInformation, updatePassword, checkPassword }