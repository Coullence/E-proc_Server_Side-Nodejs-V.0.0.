const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    create,
    countEmployees,
    countNewEmployees,
    getAll,
    getById,
    update,
    delete: _delete
};
// create data
async function create(params) {

    console.log("Service got called");
    // validation process__
    if (await db.Employee.findOne({ employeeForeignId: params.employeeForeignId })) {
        throw 'The Employee:' +  params.employeeEmail + ', is already registered';
    }
    else if (await db.Employee.findOne({ employeeEmail: params.employeeEmail })) {
        throw 'The Email: ' + params.employeeEmail + ', is already registered!';
    }
    else if (await db.Employee.findOne({ employeePhone: params.employeePhone })) {
        throw 'This Phone:' +  params.employeePhone + ', is already registered!';
    }
    else if (await db.Employee.findOne({ jobId: params.jobId })) {
        throw 'This Job ID:' +  params.jobId + ', is already registered';
    }
    else if (await db.Employee.findOne({ KRA_Pin: params.KRA_Pin })) {
        throw 'This KRA Pin:' +  params.KRA_Pin + ', is already registered';
    }
    else if (await db.Employee.findOne({ National_Id: params.National_Id })) {
        throw 'This National Id:' +  params.National_Id + ', is already registered';
    }

    

    const employee = new db.Employee(params);
    employee.verified = Date.now();

    // save data
    await employee.save();

    return basicDetails(employee);
}

/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countEmployees() {
    const employees = await db.Employees.count();
    return employees;
}
// Count New Data
async function countNewEmployees() {
    const employees = await db.Employees.count({"Status":"New"});
    return employees;
}

// get all data
async function getAll() {
    const employees = await db.Employee.find().sort({createdAt: -1});
    return employees.map(x => basicDetails(x));
}
// get data by id
async function getById(id) {
    const employee = await getEmployee(id);
    return basicDetails(employee);
}


// Update data
async function update(id, params) {
    const employee = await getEmployee(id);
    
    // validate
    if (employee.employeeEmail !== params.employeeEmail && await db.Employee.findOne({ employeeEmail: params.employeeEmail })) {
        throw 'This Email:' + params.employeeEmail + ', is already taken';
    }

    // copy params to account and save
    Object.assign(employee, params);
    employee.updated = Date.now();
    await employee.save();

    return basicDetails(employee);
}

async function _delete(id) {
    const employee = await getEmployee(id);
    await employee.remove();
}

// helper functions
async function getEmployee(id) {
    if (!db.isValidId(id)) throw 'Employee not found';
    const employee = await db.Employee.findById(id);
    if (!employee) throw 'Employee not found';
    return employee;
}


function basicDetails(employee) {

    


    const { _id, employeeName, employeeEmail, employeePhone, employeeAltPhone, jobId, KRA_Pin, jobGroup,
        National_Id,requestAs, Status, approvalStatus, employeeForeignId, createdAt, updatedAt } = employee;
    return {
        _id, employeeName, employeeEmail, employeePhone, employeeAltPhone, jobId, KRA_Pin, jobGroup,
        National_Id,requestAs, Status, approvalStatus, employeeForeignId, createdAt, updatedAt
    };
}

async function sendEmployeeNotificationEmail(account, origin) {
    await sendEmail({
        to: account.email,
        subject: 'Registration Notification',
        html: `<h4>Congratulations!</h4>
               <p>You have been registered as a Procurement Employee as from today!</p>
               <p>Please incase of any inconviniencies, Please Consult Head of Department. Thank you</p>
               `
    });
}


