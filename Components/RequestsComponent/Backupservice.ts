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
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__

    const request = new db.Requests(params);

    // save data
    await request.save();

    return basicDetails(request);
}
// get all data
async function getAll() {
    const requests = await db.requests.find();
    return requests.map(x => basicDetails(x));
}
// get data by id
async function getById(id) {
    const request = await getRequest(id);
    return basicDetails(request);
}


// Update data
async function update(id, params) {
    const request = await getRequest(id);

    // validate
    // if (s.email !== params.email && await db.Staffs.findOne({ email: params.email })) {
    //     throw 'This Email:' + params.email + ', is already taken';
    // }

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
 

// async function getRequestFId(fid) {
//     if (!db.isValidId(fid)) throw 'Request not found';
//     const request = await db.Requests.find({"staffForeignId" : $fid};
//     if (!request) throw 'Request not found';
//     return request;
// }


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

async function sendRequestNotificationEmail(account, origin) {
    await sendEmail({
        to: account.email,
        subject: 'Registration Notification',
        html: `<h4>Congratulations!</h4>
               <p>You have been registered as a Procurement Employee as from today!</p>
               <p>Please incase of any inconviniencies, Please Consult Head of Department. Thank you</p>
               `
    });
}


