//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by details view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByItemDetail));

// Route to build error
router.get("/throwerror", utilities.handleErrors(invController.buildError));



module.exports = router;