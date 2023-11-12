//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const classValidate = require('../utilities/classification-valitation')
const validate = require('../utilities/inventory-valitation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by details view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByItemDetail));

// Route to build error
router.get("/throwerror", utilities.handleErrors(invController.buildError));

// Route to management
router.get("/management", utilities.handleErrors(invController.buildManagement));


// Route to Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

//Route POST "Add Classification"
router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
    // (req, res) => {
    //   res.status(200).send('Added new classification process')
    // }
    
)

// Route to Add New Vehicle
router.get("/add-inventory", utilities.handleErrors(invController.buildAddNewCar));

//Route POST "Add New Vehicle"
router.post(
    "/add-inventory",
    validate.invRules(),
    validate.checkCarData,
    utilities.handleErrors(invController.addVehicle)
)

module.exports = router;