const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    create,
    countRequests,
    countNewRequests,
    getAll,
    getById,
    getRequestByStaffId,
    getApprovedRequestByStaffId,
    getRejectedRequestByStaffId,
    getApproved,
    getRejected,
    getProcured,
    update,
    delete: _delete,





};
// create data
async function create(params) {
    // validation process__

    const request = new db.Requests(params);

    // save data
    await request.save();

    return basicDetails(request);
}

/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countRequests() {
    const requests = await db.Requests.count();
    return requests;
}
// Count New Data
async function countNewRequests() {
    const requests = await db.Requests.count({"Status":"New"});
    return requests;
}


// get all data
async function getAll() {
    const requests = await db.Requests.find().sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}

// Get Approved Requests
async function getApproved() {
    const requests = await db.Requests.find({"requestStatus" : "Approved" }).sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}
// Get Approved Requests
async function getRejected() {
    const requests = await db.Requests.find({"requestStatus" : "Rejected" }).sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}
// Get Approved Requests
async function getProcured() {
    const requests = await db.Requests.find({"requestStatus" : "Procured" }).sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}

// get data by id
async function getById(id) {
    const request = await getRequest(id);
    return basicDetails(request);
}

async function getRequestByStaffId(id) {
    const requests = await db.Requests.find({"staffForeignId" : id }).sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}

async function getApprovedRequestByStaffId(id) {
    console.log("Got called for approvede");
    const requests = await db.Requests.find({"staffForeignId" : id, "requestStatus" : "Approved" }).sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}

async function getRejectedRequestByStaffId(id) {
    const requests = await db.Requests.find({"staffForeignId" : id, "requestStatus" : "Rejected" }).sort({createdAt: -1});
    return requests.map(x => basicDetails(x));
}



// Update data
async function update(id, params) {

    console.log("id",id);
    console.log("params", params);
    const request = await getRequest(id);
    
     // copy params to account and save 
    Object.assign(request, params);
    request.updated = Date.now();
    await request.save();

    return basicDetails(request);
}

async function _delete(id) {
    const request = await getRequest(id);
    await request.remove();
}

// helper functions
async function getRequest(id) {
    if (!db.isValidId(id)) throw 'Request not found';
    const request = await db.Requests.findById(id);
    if (!request) throw 'Request not found';
    return request;
}


function basicDetails(request) {


  const {
         _id,
        itemCategory,
        requestedItem,
        itemQuantity,
        requestStatus,
        Status,
        staffForeignId,
        createdAt,
        updatedAt
         } = request;
 
   return {
        _id,
        itemCategory,
        requestedItem,
        itemQuantity,
        requestStatus,
        Status,
        staffForeignId,
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


