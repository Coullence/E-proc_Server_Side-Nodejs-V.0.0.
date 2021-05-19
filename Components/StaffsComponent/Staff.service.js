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
    countStaffs,
    countNewStaffs,
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__

    if (await db.Staffs.findOne({ staffForeignId: params.staffForeignId })) {
        throw 'The Staff:' +  params.staffEmail + ', is already registered';
    }
    else if (await db.Staffs.findOne({ staffEmail: params.staffEmail})) {
        throw 'The Email: ' + params.staffEmail + ', is already registered!';
    }
    else if (await db.Staffs.findOne({  staffPhone: params.staffPhone })) {
        throw 'This Phone:' +  params.staffPhone + ', is already registered!';
    }
    else if (await db.Staffs.findOne({ jobId: params.jobId })) {
        throw 'This Job ID:' +  params.jobId + ', is already registered';
    }

    const staff = new db.Staffs(params);

    // save data
    await staff.save();

    return basicDetails(staff);
}
// get all data
async function getAll() {
    const staffs = await db.Staffs.find().sort({createdAt: -1});
    return staffs.map(x => basicDetails(x));
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countStaffs() {
    const staffs = await db.Staffs.count();
    return staffs;
}
// Count New Data
async function countNewStaffs() {
    const staffs = await db.Staffs.count({"Status":"New"});
    return staffs;
}

// get data by id
async function getById(id) {
    const staff = await getStaff(id);
    return basicDetails(staff);
}


// Update data
async function update(id, params) {
    const staff = await getStaff(id);
    
    // validate
    if (staff.staffEmail !== params.staffEmail && await db.Staffs.findOne({ staffEmail: params.staffEmail })) {
        throw 'This Email:' + params.staffEmail + ', is already taken';
    }

    // copy params to account and save 
    Object.assign(staff, params);
    staff.updated = Date.now();
    await staff.save();

    return basicDetails(staff);
}

async function _delete(id) {
    const staff = await getStaff(id);
    await staff.remove();
}

// helper functions
async function getStaff(id) {
    if (!db.isValidId(id)) throw 'Staff not found';
    const staff = await db.Staffs.findById(id);
    if (!staff) throw 'Staff not found';
    return staff;
}


function basicDetails(staff) {


    
    const { _id,staffFirstName,staffLastName, staffEmail,staffPhone,jobId,KRA_Pin,jobGroup,National_Id,requestAs,Status,approvalStatus,staffForeignId
,createdAt, updatedAt } = staff;
    return {
        _id,staffFirstName,staffLastName, staffEmail,staffPhone,jobId,KRA_Pin,jobGroup,National_Id,requestAs,Status,approvalStatus,staffForeignId
,createdAt, updatedAt 
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


