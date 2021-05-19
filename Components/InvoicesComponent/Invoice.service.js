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
    countInvoices,
    countNewInvoices,
    getById,
    getBySupplier,
    update,
    delete: _delete
};
// create data
async function create(params) {
    // validation process__

    const invoice = new db.Invoices(params);

    // save data
    await invoice.save();

    return basicDetails(invoice);
}
/**********************************************************
                    Count data
**********************************************************/
// Count all data
async function countInvoices() {
    const invoices = await db.Invoices.count();
    return invoices;
}
// Count New Data
async function countNewInvoices() {
    const invoices = await db.Invoices.count({"Status":"New"});
    return invoices;
}

// get all data
async function getAll() {
    const invoices = await db.Invoices.find().sort({createdAt: -1});
    return invoices.map(x => basicDetails(x));
}

// get data by id 
async function getById(id) {
    const invoices = await getInvoice(id);
    return basicDetails(invoices);
}

async function getBySupplier(id) {
    const invoices = await db.Invoices.find({"supplierForeignId" : id });

    return invoices.map(x => basicDetails(x));
}

// async function getByCategory(id) {
//     const items = await db.Items.find({"categoryForeignId" : id });
//     return items.map(x => basicDetails(x));
// }





// Update data
async function update(id, params) {
    const invoice = await getInvoice(id);
    
    // validate
    // if (invoice.email !== params.email && await db.Staffs.findOne({ email: params.email })) {
    //     throw 'This Email:' + params.email + ', is already taken';
    // }

    // copy params to account and save
    Object.assign(invoice, params);
    invoice.updated = Date.now();
    await invoice.save();

    return basicDetails(invoice);
}

async function _delete(id) {
    const invoice = await getInvoice(id);
    await invoice.remove();
}

// helper functions
async function getInvoice(id) {
    if (!db.isValidId(id)) throw 'Invoice not found';
    const invoice = await db.Invoices.findById(id);
    if (!invoice) throw 'Invoice not found';
    return invoice;
}





function basicDetails(invoice) {

    const { 
        
        _id,
        supplierCompany,
        supplierEmail,
        supplierPhone,
        itemCategory,
        item,
        itemQuantity,
        itemUnitPrice,
        Total,
        dateExpected,
        Status,
        supplierForeignId,
         createdAt, 
         updatedAt 
        } = invoice;
    return {

        _id,
        supplierCompany,
        supplierEmail,
        supplierPhone,
        itemCategory,
        item,
        itemQuantity,
        itemUnitPrice,
        Total,
        dateExpected,
        Status,
        supplierForeignId,
         createdAt, 
         updatedAt 
    };
}

async function sendInvoiceNotificationEmail(account, origin) {
    await sendEmail({
        to: account.email,
        subject: 'Registration Notification',
        html: `<h4>Congratulations!</h4>
               <p>You have been registered as a Procurement Employee as from today!</p>
               <p>Please incase of any inconviniencies, Please Consult Head of Department. Thank you</p>
               `
    });
}


