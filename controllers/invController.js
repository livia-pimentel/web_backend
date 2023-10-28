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

module.exports = invCont