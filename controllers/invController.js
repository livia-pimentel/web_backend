const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch(error) {
    console.error("buildByClasificationId error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }

}

/* ***************************
 *  Build inventory by item detail view
 * ************************** */
invCont.buildByItemDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInvId(inv_id)
    const grid_detail= await utilities.buildByItemDetailGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].inv_model
    res.render("./inventory/detail", {
      title: className + " vehicles",
      nav,
      grid_detail,
    })
  } catch(error) {
    console.error("buildByItemDetail error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }

}

/* ***************************
 *  Build 500 Error
 * ************************** */
invCont.buildError = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInvId(inv_id)
    const grid_detail= await utilities.buildByItemDetailGrid(data)
    // let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: " vehicles",
      nav,
      grid_detail,
    })
  } catch(error) {
    console.error("buildError error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }

}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } catch(error) {
    console.error("buildManagement error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } catch(error) {
    console.error("buildAddClassification error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
}

/* ***************************
 *  Build Add New Car view
 * ************************** */
invCont.buildAddNewCar = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByInvId(inv_id)
  const classificationList= await utilities.buildClassificationList(data)
  let nav = await utilities.getNav()
  try {
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classificationList
    })
  } catch(error) {
    console.error("buildAddNewCar error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
}

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.addClassification = async function  (req, res) {
  const { classification_name } = req.body
  const addClassResult = await invModel.addClassification(
    classification_name
  )
  let nav = await utilities.getNav()
  // console.log(addClassResult)
  if (addClassResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the add classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Add Vehicle
* *************************************** */
invCont.addVehicle = async function  (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_descripton, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const addVehicleResult = await invModel.addVehicle(
    classification_id, inv_make, inv_model, inv_descripton, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )
  console.log(addVehicleResult)
  if (addVehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`,
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the add vehicle failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classificationList
    })
  }
}


module.exports = invCont