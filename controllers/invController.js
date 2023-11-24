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
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
      classificationList,
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
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  // console.log('variables for new vehicle', classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color )
  const addVehicleResult = await invModel.addVehicle(
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )
  // console.log(addVehicleResult)
  if (addVehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`,
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
      classificationList
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit view
 * ************************** */
invCont.buildEditCar = async function (req, res, next) {
  const inv_id = req.params.inv_id
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  // console.log("Data from the database: ", data[0]);
  const classificationList= await utilities.buildClassificationList(data[0].classification_id)
  const dataName = `${data[0].inv_make} ${data[0].inv_model}`
  
  try {
    res.render("./inventory/edit", {
      title: "Edit " + dataName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_description: data[0].inv_description,
      inv_image: data[0].inv_image,
      inv_thumbnail: data[0].inv_thumbnail,
      inv_price: data[0].inv_price,
      inv_miles: data[0].inv_miles,
      inv_color: data[0].inv_color,
      classification_id: data[0].classification_id
    })
  } catch(error) {
    console.error("buildEditCar error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
}

/* ****************************************
*  Process Update Vehicle
* *************************************** */
invCont.updateVehicle = async function  (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
  // console.log('description from controller', inv_description)
  const updateVehicleResult = await invModel.updateVehicle(
    classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id
  )
  // console.log(updateVehicleResult)
  if (updateVehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully update.`,
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
      classificationList
    })
  } else {
    req.flash("notice", "Sorry, the add vehicle failed.")
    res.status(501).render("./inventory/edit", {
      title: "Edit ",
      nav,
      errors: null,
      classificationList
    })
  }
}

/* ***************************
 *  Build Delete view
 * ************************** */
invCont.buildDeleteCar = async function (req, res, next) {
  const inv_id = req.params.inv_id
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const dataName = `${data[0].inv_make} ${data[0].inv_model}`
  try {
    res.render("./inventory/delete", {
      title: "Delete " + dataName,
      nav,
      errors: null,
      inv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_price: data[0].inv_price,
    })
  } catch(error) {
    console.error("buildDeleteCar error: " + error);
    res.render("errors/error", {
      title: "Server Error",
      message: "There was a server error.",
      nav: await utilities.getNav(),
    });
  }
}

/* ****************************************
*  Process Delete Vehicle
* *************************************** */
invCont.deleteVehicle = async function  (req, res) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    req.flash(
      "notice",
      `The deletion was successfully.`,
      res.redirect('/inv/')
    )
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect('/inv/delete/')
  }
}

module.exports = invCont