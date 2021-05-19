const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const categoryService = require('./Category.service');

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
// Read by ID
router.get('/:id', getById);
// update 
router.put('/:id', updateSchema, update);
// Delete
router.delete('/:id', _delete);


router.get('/count',  countCategories);
router.get('/count/new',  countNewCategories);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({

        categoryName: Joi.string().required(),
        Status: Joi.string().required(),
        supplierForeignId:Joi.string(),
        itemForeignId:Joi.string(),

    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    categoryService.create(req.body)
        .then(category => res.json(category))
        .catch(next);
}

function NotifyOnRegistrtionEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


/* -------------------------------//
Get All Categoris
// ------------------------------ */

function getAll(req, res, next) {
    categoryService.getAll()
        .then(categories => res.json(categories))
        .catch(next);
}

function countCategories(req, res, next) {
    categoryService.countCategories()
        .then(category => res.json(category))
        .catch(next);
}

function countNewCategories(req, res, next) {
    categoryService.countNewCategories()
        .then(category => res.json(category))
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

    categoryService.getById(req.params.id)
        .then(category => category ? res.json(category) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({
        
        categoryName: Joi.string().required(),
        Status: Joi.string().required(),
        supplierForeignId:Joi.string(),
        itemForeignId:Joi.string(),
    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {


    // users can update their own account and admins can update any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    categoryService.update(req.params.id, req.body)
        .then(category => res.json({ message: 'Data Updated successfully' }))
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

    categoryService.delete(req.params.id)
        .then(() => res.json({ message: 'Category deleted successfully' }))
        .catch(next);
}
