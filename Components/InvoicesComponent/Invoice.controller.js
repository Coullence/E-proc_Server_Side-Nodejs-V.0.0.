const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const invoiceService = require('./Invoice.service');

// // Create New
// router.post('/', authorize([Role.Admin, Role.Supplier]), createSchema, create);
// // Read all
// router.get('/', authorize(Role.Admin), getAll);
// // Read by ID
// router.get('/:id', authorize([Role.Admin, Role.Supplier]), getById);
// // update 
// router.put('/:id', authorize([Role.Admin, Role.Supplier]), updateSchema, update);
// // Delete
// router.delete('/:id', authorize([Role.Admin, Role.Supplier]), _delete);


// router.get('/count',  countInvoice);
// router.get('/count/new',  countNewInvoice);


// Create New
router.post('/', createSchema, create);
// Read all
router.get('/',  getAll);
router.get('/for/supplier/:id',  getBySupplier);
// Read by ID
router.get('/:id', getById);
// update 
router.put('/:id',  updateSchema, update);
// Delete
router.delete('/:id',  _delete);




router.get('/count',  countInvoice);
router.get('/count/new',  countNewInvoice);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({

        supplierCompany: Joi.string(),
        supplierEmail: Joi.string(),
        supplierPhone: Joi.string(),
        itemCategory: Joi.string(),
        item: Joi.string(),
        itemQuantity: Joi.number(),
        itemUnitPrice: Joi.string(),
        Total: Joi.number(),
        dateExpected: Joi.string(),
        Status: Joi.string(),
        supplierForeignId: Joi.string(),


    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    console.log("got called");
    invoiceService.create(req.body)
        .then(invoice => res.json(invoice))
        .catch(next);
}

function NotifyOnRegistrtionEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


/* -------------------------------//
Get All Invoices
// ------------------------------ */

function getAll(req, res, next) {
    invoiceService.getAll()
        .then(staffs => res.json(staffs))
        .catch(next);
}

function countInvoice(req, res, next) {
    invoiceService.countInvoice()
        .then(invoice => res.json(invoice))
        .catch(next);
}

function countNewInvoice(req, res, next) {
    invoiceService.countNewInvoice()
        .then(invoice => res.json(invoice))
        .catch(next);
}



/* -------------------------------//
Create Single Employee
// ------------------------------ */

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    invoiceService.getById(req.params.id)
        .then(invoice => invoice ? res.json(invoice) : res.sendStatus(404))
        .catch(next);
}

function getBySupplier(req, res, next) {
    console.log("got called");
    invoiceService.getBySupplier(req.params.id)
        .then(items => res.json(items))
        .catch(next);
}


/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({

        supplierCompany: Joi.string(),
        supplierEmail: Joi.string(),
        supplierPhone: Joi.string(),
        itemCategory: Joi.string(),
        item: Joi.string(),
        itemQuantity: Joi.number(),
        itemUnitPrice: Joi.string(),
        Total: Joi.Joi.number(),
        dateExpected: Joi.string(),
        Status: Joi.string(),
        supplierForeignId: Joi.string(),


    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {
    // users can update their own account and admins can update any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    invoiceService.update(req.params.id, req.body)
        .then(invoice => res.json(invoice))
        .catch(next);
}


/* -------------------------------//
Remove  Invoice
// ------------------------------ */

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    invoiceService.delete(req.params.id)
        .then(() => res.json({ message: 'Invoice deleted successfully' }))
        .catch(next);
}
