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
    countTenders,
    countNewTenders,
    countOpenTenders,
    countClosedTenders,
    getByCategory,
    getOpen_Tender,
    getTender_Request,
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__

       if (await db.Tenders.findOne({ itemName: params.itemName })) {
        throw 'The Tender Request:' +  params.itemName + ', is already Posted!';
    }
 
    const tender = new db.Tenders(params);

    // save data
    await tender.save();

    return basicDetails(tender);
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countTenders() {
    const tenders = await db.Tenders.count();
    return tenders;
}
// Count New Data
async function countNewTenders() {
    const tenders = await db.Tenders.count({"Status":"New"});
    return tenders;
}

// Count New Data
async function countOpenTenders() {
    const tenders = await db.Tenders.count({"tenderStatus" : "Open_Tender"});
    return tenders;
}

// Count New Data
async function countClosedTenders() {
    const tenders = await db.Tenders.count({"tenderStatus" : "Closed_Tender"});
    return tenders;
}

// get all data
async function getAll() {
    const tenders = await db.Tenders.find().sort({createdAt: -1});
    return tenders.map(x => basicDetails(x));
}

// Get Tenders
async function getByCategory(id) {
    const tenders = await db.Tenders.find({"categoryForeignId" : id }).sort({createdAt: -1});
    return tenders.map(x => basicDetails(x)); 
}
async function getOpen_Tender() {
    const tenders = await db.Tenders.find({"tenderStatus" : "Open_Tender" }).sort({createdAt: -1});
    return tenders.map(x => basicDetails(x)); 
}

async function getTender_Request() {
    const tenders = await db.Tenders.find({"tenderStatus" : "Tender_Request" }).sort({createdAt: -1});
    return tenders.map(x => basicDetails(x)); 
}

// get data by id
async function getById(id) {
    const tender = await getTender(id);
    return basicDetails(tender);
}


// Update data
async function update(id, params) {
    const tender = await getTender(id);
    
     // copy params to account and save 
    Object.assign(tender, params);
    tender.updated = Date.now();
    await tender.save();

    return basicDetails(tender);
}

async function _delete(id) {
    const tender = await getTender(id);
    await tender.remove();
}

// helper functions
async function getTender(id) {
    if (!db.isValidId(id)) throw 'Tender not found';
    const tender = await db.Tenders.findById(id);
    if (!tender) throw 'Tender not found';
    return tender;
}


function basicDetails(tender) {


  const {

         _id,
        tenderStatus,
        categoryForeignId,
        itemName,
        itemCategory,
        itemQuantity,
        dueDate,
        vendorQuotation,
        vendorForeignId,
        unitPricing,
        supplierId,
        createdAt,
        updatedAt
         } = tender;
 
   return {

         _id,
        tenderStatus,
        categoryForeignId,
        itemName,
        itemCategory,
        itemQuantity,
        dueDate,
        vendorQuotation,
        vendorForeignId,
        unitPricing,
        supplierId,
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


