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
    countVendors,
    countNewVendors,
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__
    // if (await db.Staffs.findOne({ userForeignId: params.userForeignId })) {
    //     throw 'The Staff:' +  params.email + ', is already registered';
    // }
    // else if (await db.Staffs.findOne({ email: params.email })) {
    //     throw 'The Email: ' + params.email + ', is already registered!';
    // }
    // else if (await db.Staffs.findOne({ phone: params.phone })) {
    //     throw 'This Phone:' +  params.phone + ', is already registered!';
    // }
    // else if (await db.Staffs.findOne({ jobId: params.jobId })) {
    //     throw 'This Job ID:' +  params.jobId + ', is already registered';
    // }
    
    const vendor = new db.Vendors(params);

    // save data
    await vendor.save();

    return basicDetails(vendor);
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countVendors() {
    const vendors = await db.Vendors.count();
    return vendors;
}
// Count New Data
async function countNewVendors() {
    const vendors = await db.Vendors.count({"Status":"New"});
    return vendors;
}

// get all data
async function getAll() {
    const vendors = await db.Vendors.find();
    return vendors.map(x => basicDetails(x));
}
// get data by id
async function getById(id) {
    const vendor = await getVendor(id);
    return basicDetails(vendor);
}


// Update data
async function update(id, params) {
    const vendor = await getVendor(id);
    
    // validate
    if (vendor.vendorEmail !== params.vendorEmail && await db.Vendors.findOne({ vendorEmail: params.vendorEmail})) {
        throw 'This Email:' + params.vendorEmail + ', is already taken';
    }

    // copy params to account and save
    Object.assign(vendor, params);
    vendor.updated = Date.now();
    await vendor.save();

    return basicDetails(vendor);
}

async function _delete(id) {
    const vendor = await getVendor(id);
    await vendor.remove();
}

// helper functions
async function getVendor(id) {
    if (!db.isValidId(id)) throw 'Vendor not found';
    const vendor = await db.Vendors.findById(id);
    if (!vendor) throw 'Vendor not found';
    return vendor;
}


function basicDetails(vendor) {


    const { _id, fullName,email,phone,jobId,jobGroup,jobStatus,Status,userForeignId,createdAt, updatedAt } = staff;
    return {
        _id, fullName,email,phone,jobId,jobGroup,jobStatus,Status,userForeignId,createdAt, updatedAt
    };
}

async function sendStaffNotificationEmail(account, origin) {
    await sendEmail({
        to: account.email,
        subject: 'Registration Notification',
        html: `<h4>Congratulations!</h4>
               <p>You have been registered as a Procurement Employee as from today!</p>
               <p>Please incase of any inconviniencies, Please Consult Head of Department. Thank you</p>
               `
    });
}


