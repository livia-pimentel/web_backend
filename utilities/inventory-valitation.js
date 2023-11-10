const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateInv = {}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validateInv.invRules = () => {
    return [
        // classification is required
        body("classification_id")
        //   .trim()
        //   .isLength({ min: 1 })
          .withMessage("Please provide a classification."), // on error this message is sent.
    
        // maker is required and must be string
        body("inv_make")
          .trim()
          .isAlpha()
          .isLength({ min: 2 })
          .withMessage("Please provide a maker."), // on error this message is sent.
    
        // model is required and cannot already exist in the DB
        body("inv_model")
        .trim()
        .withMessage("The model is required."),

        // Description is required
        body("inv_descripton")
        .trim()
        .isAlpha()
        .isLength({ min: 10 })
        .withMessage("Please provide a description."), // on error this message is sent.

        // Image is required
        body("inv_image")
        .trim()
        .withMessage("Please provide an image."), // on error this message is sent.

        // Thumbnail is required
        body("inv_thumbnail")
        .trim()
        .withMessage("Please provide a thumbnail."), // on error this message is sent.

        // Price is required
        body("inv_price")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide the price."), // on error this message is sent.

        // Year is required
        body("inv_year")
        .trim()
        .isNumeric()
        .isLength({ max: 4 })
        .withMessage("Please provide the year."), // on error this message is sent.

        // Miles are required
        body("inv_miles")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide the miles."), // on error this message is sent.

        // Color is required
        body("inv_color")
        .trim()
        .isAlpha()
        .isLength({ min: 3 })
        .withMessage("Please provide the color."), // on error this message is sent.
        
    ]
}

/* ******************************
 * Check data and return errors or continue to add new car
 * ***************************** */
validateInv.checkCar = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_descripton, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inv/add-inventory", {
      errors,
      title: "Add New Car",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_descripton,
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
 * Check data and return errors or continue to add new car
 * ***************************** */
validateInv.checkCarData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_descripton, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inv/add-inventory", {
      errors,
      title: "Add New Car",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_descripton,
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
  
  module.exports = validateInv
