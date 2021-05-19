const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    create,
    getAll,
    countCategories,
    countNewCategories,
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__

      if (await db.Categories.findOne({ categoryName: params.categoryName })) {
        throw 'The Category:' +  params.categoryName + ', is already registered';
    }
 
    const category = new db.Categories(params);

    // save data
    await category.save();

    return basicDetails(category);
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countCategories() {
    const categories = await db.Categories.count();
    return categories;
}
// Count New Data
async function countNewCategories() {
    const categories = await db.Categories.count({"Status":"New"});
    return categories;
}
// get all data
async function getAll() {
    const categories = await db.Categories.find().sort({createdAt: -1});
    return categories.map(x => basicDetails(x));
}
// get data by id
async function getById(id) {
    const category = await getItem(id);
    return basicDetails(category);
}


// Update data
async function update(id, params) {
    const category = await getItem(id);
    
     // copy params to account and save 
    Object.assign(category, params);
    category.updated = Date.now();
    await category.save();

    return basicDetails(category);
}

async function _delete(id) {
    const category = await getItem(id);
    await category.remove();
}

// helper functions
async function getItem(id) {
    if (!db.isValidId(id)) throw 'Category not found';
    const category = await db.Categories.findById(id);
    if (!category) throw 'Category not found';
    return category;
}


function basicDetails(category) {


  const {

         _id,
        categoryName,
        Status,
        supplierForeignId,
        itemForeignId,
        createdAt,
        updatedAt
         } = category;
 
   return {

         _id,
        categoryName,
        Status,
        supplierForeignId,
        itemForeignId,
        createdAt,
        updatedAt
     };
}

async function sendStaffNotificationEmail(account, origin) {
    await sendEmail({
        to: account.staffEmail,
        subject: 'Registration Notification',
        html: `<h4>Congratulations!</h4>
               <p>You have been registered as a Procurement Employee as from today!</p>
               <p>Please incase of any inconviniencies, Please Consult Head of Department. Thank you</p>
               `
    });
}


