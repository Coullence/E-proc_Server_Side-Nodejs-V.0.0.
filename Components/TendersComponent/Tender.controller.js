const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const tenderService = require('./Tender.service');

// Create New
// router.post('/', authorize([Role.Admin, Role.Staff]), createSchema, create);
// // Read all
// router.get('/', authorize(Role.Admin), getAll);
// // Read by ID
// router.get('/:id', authorize([Role.Admin, Role.Staff]), getById);
// // update 
// router.put('/:id', authorize([Role.Admin, Role.Staff]), updateSchema, update);
// // Delete
// router.delete('/:id', authorize([Role.Admin, Role.Staff]), _delete);


router.post('/', createSchema, create);
// Read all 
router.get('/',  getAll);

router.get('/open',  getOpen_Tender);
router.get('/requests',  getTender_Request);
router.get('/by_category/:id',  getByCategory);
// Read by ID
router.get('/:id', getById);
// update 
router.put('/:id', updateSchema, update);
// Delete
router.delete('/:id', _delete);


router.get('/count',  countTenders);
router.get('/count/new',  countNewTenders);
router.get('/count/open',  countOpenTenders);
router.get('/count/closed',  countClosedTenders);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({


    tenderStatus:       Joi.string(),
    categoryForeignId:  Joi.string(),
    itemName:           Joi.string(),
    itemCategory:       Joi.string(),
    itemQuantity:       Joi.number(),
    dueDate:            Joi.string(),
    vendorQuotation:    Joi.number(),
    vendorForeignId:    Joi.string(),
    unitPricing:        Joi.string(),
    supplierId:         Joi.string(),

    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    tenderService.create(req.body)
        .then(tender => res.json(tender))
        .catch(next);
}

function NotifyOnRegistrtionEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


/* -------------------------------//
Get All Employee
// ------------------------------ */

function getAll(req, res, next) {
    tenderService.getAll()
        .then(tenders => res.json(tenders))
        .catch(next);
}

function countTenders(req, res, next) {
    tenderService.countTenders()
        .then(tender => res.json(tender))
        .catch(next);
}

function countNewTenders(req, res, next) {
    tenderService.countNewTenders()
        .then(tender => res.json(tender))
        .catch(next);
}


function countOpenTenders(req, res, next) {
    tenderService.countOpenTenders()
        .then(tender => res.json(tender))
        .catch(next);
}

function countClosedTenders(req, res, next) {
    tenderService.countClosedTenders()
        .then(tender => res.json(tender))
        .catch(next);
}


function getByCategory(req, res, next) {
    tenderService.getByCategory(req.params.id)
        .then(tenders => res.json(tenders))
        .catch(next);
}


function getOpen_Tender(req, res, next) {
    tenderService.getOpen_Tender()
        .then(tenders => res.json(tenders))
        .catch(next);
}

function getTender_Request(req, res, next) {
    tenderService.getTender_Request()
        .then(tenders => res.json(tenders))
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

    tenderService.getById(req.params.id)
        .then(tender => tender ? res.json(tender) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({
        
    tenderStatus:       Joi.string(),
    categoryForeignId:  Joi.string(),
    itemName:           Joi.string(),
    itemCategory:       Joi.string(),
    itemQuantity:       Joi.number(),
    dueDate:            Joi.string(),
    vendorQuotation:    Joi.number(),
    vendorForeignId:    Joi.string(),
    unitPricing:        Joi.string(),
    supplierId:         Joi.string(),

    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {


    // users can update their own account and admins can update any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    tenderService.update(req.params.id, req.body)
        .then(tender => res.json({ message: 'Data Updated successfully' }))
        .catch(next);
}




/* -------------------------------//
Remove  Employee
// ------------------------------ */

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    tenderService.delete(req.params.id)
        .then(() => res.json({ message: 'Data deleted successfully' }))
        .catch(next);
}
