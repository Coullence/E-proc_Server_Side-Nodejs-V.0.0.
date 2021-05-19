const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const supplierService = require('./Supplier.service');

// Create New
router.post('/', authorize([Role.Admin, Role.Supplier]), createSchema, create);
// Read all
router.get('/', authorize(Role.Admin), getAll);
// Read by ID
router.get('/:id', authorize([Role.Admin, Role.Supplier]), getById);
// update 
router.put('/:id', authorize([Role.Admin, Role.Supplier]), updateSchema, update);
// Delete
router.delete('/:id', authorize([Role.Admin, Role.Supplier]), _delete);


router.get('/count',  countSuppliers);
router.get('/count/new',  countNewSuppliers);

module.exports = router;




/* -------------------------------//
Create New Supplier
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({

        supplierCompany: Joi.string().required(),
        supplierPin: Joi.string().required(),
        supplierEmail: Joi.string().required(),
        supplierPhone: Joi.string().required(),
        supplierAdress: Joi.string().required(),
        supplierLocation: Joi.string().required(),
        supplierCategory: Joi.string().required(),
        quotation: Joi.string().required(),
        Status: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    supplierService.create(req.body)
        .then(supplier => res.json(supplier))
        .catch(next);
}

function NotifyOnRegistrtionEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


/* -------------------------------//
Get All Suppliers
// ------------------------------ */

function getAll(req, res, next) {
    supplierService.getAll()
        .then(suppliers => res.json(suppliers))
        .catch(next);
}

function countSuppliers(req, res, next) {
    supplierService.countSuppliers()
        .then(supplier => res.json(supplier))
        .catch(next);
}

function countNewSuppliers(req, res, next) {
    supplierService.countNewSuppliers()
        .then(supplier => res.json(supplier))
        .catch(next);
}




/* -------------------------------//
Create Single Supplier
// ------------------------------ */

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    supplierService.getById(req.params.id)
        .then(supplier => supplier ? res.json(supplier) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({
        supplierCompany: Joi.string().required(),
        supplierPin: Joi.string().required(),
        supplierEmail: Joi.string().required(),
        supplierPhone: Joi.string().required(),
        supplierAdress: Joi.string().required(),
        supplierLocation: Joi.string().required(),
        supplierCategory: Joi.string().required(),
        quotation: Joi.string().required(),
        Status: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    supplierService.update(req.params.id, req.body)
        .then(supplier => res.json(supplier))
        .catch(next);
}


/* -------------------------------//
Remove  Employee
// ------------------------------ */

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    supplierService.delete(req.params.id)
        .then(() => res.json({ message: 'Supplier deleted successfully' }))
        .catch(next);
}
