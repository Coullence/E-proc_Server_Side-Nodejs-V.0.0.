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
    countItems,
    countNewItems,
    getByCategory,
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__
 
    const item = new db.Items(params);

    // save data
    await item.save();

    return basicDetails(item);
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countItems() {
    const items = await db.Items.count({"Status":"New"});
    return items;
}
// Count New Data
async function countNewItems() {
    const items = await db.Items.count({"Status":"New"});
    return items;
}

// get all data
async function getAll() {
    const items = await db.Items.find().sort({createdAt: -1});
    return items.map(x => basicDetails(x));
}

// Get Staffs
async function getByCategory(id) {
    const items = await db.Items.find({"categoryForeignId" : id });
    return items.map(x => basicDetails(x));
}

// get data by id
async function getById(id) {
    const item = await getItem(id);
    return basicDetails(item);
}


// Update data
async function update(id, params) {
    const item = await getItem(id);
    
     // copy params to account and save 
    Object.assign(item, params);
    item.updated = Date.now();
    await item.save();

    return basicDetails(item);
}

async function _delete(id) {
    const item = await getItem(id);
    await item.remove();
}

// helper functions
async function getItem(id) {
    if (!db.isValidId(id)) throw 'Item not found';
    const item = await db.Items.findById(id);
    if (!item) throw 'Item not found';
    return item;
}


function basicDetails(item) {


  const {


         _id,
        itemName,
        itemQuantity,
        Status,
        expectedDate,
        categoryForeignId,
        createdAt,
        updatedAt
         } = item;
 
   return {

         _id,
        itemName,
        itemQuantity,
        Status,
        expectedDate,
        categoryForeignId,
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


