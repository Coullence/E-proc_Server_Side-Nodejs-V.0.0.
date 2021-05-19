const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const vendorService = require('./Vendor.service');

// Create New
router.post('/', authorize([Role.Admin, Role.Vendor]), createSchema, create);
// Read all
router.get('/', authorize(Role.Admin), getAll);
// Read by ID
router.get('/:id', authorize([Role.Admin, Role.Vendor]), getById);
// update 
router.put('/:id', authorize([Role.Admin, Role.Vendor]), updateSchema, update);
// Delete
router.delete('/:id', authorize([Role.Admin, Role.Vendor]), _delete);


router.get('/count',  countVendors);
router.get('/count/new',  countNewVendors);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({

        vendorCompany:    Joi.string().required(),
        vendorPin:        Joi.string().required(),
        vendorEmail:      Joi.string().required(),
        vendorPhone:      Joi.string().required(),
        vendorAdress:     Joi.string().required(),
        vendorLocation:   Joi.string().required(),
        vendorCategory:   Joi.string().required(),
        quotation:        Joi.string().required(),
        Status:           Joi.string().required(),
    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    vendorService.create(req.body)
        .then(vendor => res.json(vendor))
        .catch(next);
}

function NotifyOnRegistrtionEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


/* -------------------------------//
Get All Vendors
// ------------------------------ */

function getAll(req, res, next) {
    vendorService.getAll()
        .then(vendors => res.json(vendors))
        .catch(next);
}

function countVendors(req, res, next) {
    vendorService.countVendors()
        .then(vendor => res.json(vendor))
        .catch(next);
}

function countNewVendors(req, res, next) {
    vendorService.countNewVendors()
        .then(vendor => res.json(vendor))
        .catch(next);
}



/* -------------------------------//
Create Single Vendor
// ------------------------------ */

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    vendorService.getById(req.params.id)
        .then(vendor => vendor ? res.json(vendor) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Vendor
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({
 
        vendorCompany:    Joi.string().required(),
        vendorPin:        Joi.string().required(),
        vendorEmail:      Joi.string().required(),
        vendorPhone:      Joi.string().required(),
        vendorAdress:     Joi.string().required(),
        vendorLocation:   Joi.string().required(),
        vendorCategory:   Joi.string().required(),
        quotation:        Joi.string().required(),
        Status:           Joi.string().required(),
    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    vendorService.update(req.params.id, req.body)
        .then(vendor => res.json(vendor))
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

    vendorService.delete(req.params.id)
        .then(() => res.json({ message: 'Vendor deleted successfully' }))
        .catch(next);
}
