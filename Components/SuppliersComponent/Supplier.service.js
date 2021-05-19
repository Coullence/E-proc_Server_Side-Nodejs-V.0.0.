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
    countSuppliers,
    countNewSuppliers,
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

    const supplier = new db.Suppliers(params);

    // save data
    await supplier.save();

    return basicDetails(supplier);
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countSuppliers() {
    const suppliers = await db.Suppliers.count();
    return suppliers;
}
// Count New Data
async function countNewSuppliers() {
    const suppliers = await db.Suppliers.count({"Status":"New"});
    return suppliers;
}
// get all data
async function getAll() {
    const suppliers = await db.Suppliers.find().sort({createdAt: -1});
    return suppliers.map(x => basicDetails(x));
}
// get data by id
async function getById(id) {
    const supplier = await getSupplier(id);
    return basicDetails(supplier);
}


// Update data
async function update(id, params) {
    const supplier = await getSupplier(id);
    
    // validate
    // if (supplier.email !== params.email && await db.Staffs.findOne({ email: params.email })) {
    //     throw 'This Email:' + params.email + ', is already taken';
    // }

    // copy params to account and save
    Object.assign(supplier, params);
    supplier.updated = Date.now();
    await supplier.save();

    return basicDetails(supplier);
}

async function _delete(id) {
    const supplier = await getSupplier(id);
    await supplier.remove();
}

// helper functions
async function getSupplier(id) {
    if (!db.isValidId(id)) throw 'Supplier not found';
    const supplier = await db.Supplier.findById(id);
    if (!supplier) throw 'Supplier not found';
    return supplier;
}


function basicDetails(supplier) {


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


