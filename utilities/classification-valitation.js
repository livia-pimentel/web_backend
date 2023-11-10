const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateClass = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validateClass.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 3 })
      .isAlpha()
      .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) // Convert the first letter to uppercase and the last letter to lowercase
      .withMessage("Provide a correct classification name") 
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClass(classification_name);
        console.log('Classification Exist Content', classificationExists);
        if (classificationExists) {
          throw new Error("Classification exists!");
        }
      }),
  ];
};



  /* ******************************
 * Check data and return errors or continue to add classification
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
