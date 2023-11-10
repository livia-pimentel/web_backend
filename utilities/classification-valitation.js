const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateClass = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validateClass.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .isLength({ min: 3 })
        .isAlpha()
        .withMessage("Provide a correct classification name") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingclassification(classification_name)
            console.log('Classification Exist Content',classificationExists)
            if (classificationExists) {
              throw new Error ("classification exists!");
            }
          }),
    ];
  };

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
  validateClass.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validateClass
