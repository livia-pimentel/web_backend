const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.invRules = () => {
    return [
        // classification is required
        body("classification_id")
          .trim()
          .notEmpty()
          .withMessage("Please provide a classification."), // on error this message is sent.
    
        // maker is required and must be string
        body("inv_make")
          .trim()
          .isLength({ min: 2 })
          .customSanitizer(value => {
            // Capitalize the first letter of each word
            return value.replace(/\b\w/g, (match) => match.toUpperCase());
        })
          .withMessage("Please provide a maker, minimum of 2 characters "), // on error this message is sent.
    
        // model is required and cannot already exist in the DB
        body("inv_model")
        .trim()
        .isLength({ min: 2 })
        .customSanitizer(value => {
          // Capitalize the first letter of each word
          return value.replace(/\b\w/g, (match) => match.toUpperCase());
      })
        .withMessage("Please provide a model, minimum of 2 characters"),

        // Description is required
        body("inv_description")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a description."), // on error this message is sent.

        // Image is required
        body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an image."), // on error this message is sent.

        // // Thumbnail is required
        body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail."), // on error this message is sent.

        // // Price is required
        body("inv_price")
        .trim()
        .isLength({ min: 1 })
        .isFloat()
        .isNumeric()
        .withMessage("Please provide the price, decimal, or integer"),

        // // Year is required
        body("inv_year")
        .trim()
        .isNumeric()
        .custom(value => {
          const numericValue = Number(value);
          return Number.isInteger(numericValue) && value.length === 4;
        })
        .withMessage("Please provide the year with 4 digits"), // on error this message is sent.

        // // Miles are required
        body("inv_miles")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide the miles, only digits"), // on error this message is sent.

        // // Color is required
        body("inv_color")
        .trim()
        .isAlpha()
        .isLength({ min: 3 })
        .customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) //Convert the first letter to uppercase and the last letter to lowercase
        .withMessage("Please provide the color.") // on error this message is sent.
        
    ]
}

/* ******************************
 * Check data and return errors or continue to add new car
 * ***************************** */
validate.checkCarData = async (req, res, next) => {
  let classificationList = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image, 
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update car
 * ***************************** */
validate.checkEditCar = async (req, res, next) => {
  let classificationList = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/edit", {
      errors,
      title: "Edit " + inv_make + inv_model,
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image, 
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

  module.exports = validate
