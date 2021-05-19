const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const itemService = require('./Item.service');

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

router.get('/by_category/:id',  getByCategory);
// Read by ID
router.get('/:id', getById);
// update 
router.put('/:id', updateSchema, update);
// Delete
router.delete('/:id', _delete);


router.get('/count',  countItems);
router.get('/count/new',  countNewItems);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({


        itemName: Joi.string().required(),
        itemQuantity: Joi.string().required(),
        Status: Joi.string().required(),
        expectedDate: Joi.string().required(),
        categoryForeignId:Joi.string().required(),

    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    itemService.create(req.body)
        .then(item => res.json(item))
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
    itemService.getAll()
        .then(items => res.json(items))
        .catch(next);
}

function countItems(req, res, next) {
    itemService.countItems()
        .then(item => res.json(item))
        .catch(next);
}

function countNewItems(req, res, next) {
    itemService.countNewItems()
        .then(item => res.json(item))
        .catch(next);
}



function getByCategory(req, res, next) {
    itemService.getByCategory(req.params.id)
        .then(items => res.json(items))
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

    itemService.getById(req.params.id)
        .then(item => item ? res.json(item) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({
        
        itemName: Joi.string().required(),
        itemQuantity: Joi.string().required(),
        Status: Joi.string().required(),
        expectedDate: Joi.string().required(),
        categoryForeignId:Joi.string().required(),
    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {


    // users can update their own account and admins can update any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    itemService.update(req.params.id, req.body)
        .then(item => res.json({ message: 'Data Updated successfully' }))
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

    itemService.delete(req.params.id)
        .then(() => res.json({ message: 'Staff deleted successfully' }))
        .catch(next);
}
