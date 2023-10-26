const invModel = require("../models/inventory-model")
const { route } = require("../routes/static")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    // console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            ' " title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul class="classification-grid" id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildByItemDetailGrid = async function(data){
  let grid_detail
  if(data.length > 0){
    grid_detail = '<div class="detail-grid">'
    data.forEach(vehicle => { 
      grid_detail += '<div>'
      grid_detail += '<h1>'
      grid_detail += vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
      grid_detail +=  '<a href="../../detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_image
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
      grid_detail += '</div>'
      grid_detail += '<section>'
      grid_detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      grid_detail += '<span><strong>Price:</strong> ' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span><br><br>'
      grid_detail += '<span><strong>Detail:</strong> ' + vehicle.inv_description + '</span><br><br>'
      grid_detail += '<span><strong>Color:</strong> ' + vehicle.inv_color + '</span><br><br>'
      grid_detail += '<span><strong>Miles:</strong> ' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span><br>'
      grid_detail += '</section>'
      
    })
    grid_detail += '</div>'
  } else { 
    grid_detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid_detail
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
