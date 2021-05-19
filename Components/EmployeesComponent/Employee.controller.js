const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const employeeService = require('./Employee.service');

// Create New
// router.post('/', authorize([Role.Admin, Role.Authenticated]), createSchema, create);
// // Read all
// router.get('/', authorize(Role.Admin), getAll);
// // Read by ID
// router.get('/:id', authorize([Role.Admin, Role.Employee]), getById);
// // update 
// router.put('/:id', authorize([Role.Admin, Role.Employee]), updateSchema, update);
// // Delete
// router.delete('/:id', authorize(Role.Admin), _delete);


// To be updated when lclient side interceptor is ready
router.post('/', createSchema, create);
// Read all
router.get('/', getAll);

router.get('/count', countEmployee);
router.get('/count/new', countNewEmployee);
// Read by ID
router.get('/:id', getById);
// update 
router.put('/:id', updateSchema, update);
// Delete
router.delete('/:id',  _delete);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({
        employeeName: Joi.string().required(),
        employeeEmail: Joi.string().required(),
        employeePhone: Joi.string().required(),
        employeeAltPhone: Joi.string().required(),
        jobId: Joi.string().required(),
        KRA_Pin: Joi.string().required(),
        jobGroup: Joi.string().required(),
        National_Id: Joi.string().required(),
        requestAs: Joi.string().required(),
        Status: Joi.string().required(),
        approvalStatus: Joi.string().required(),
        employeeForeignId: Joi.string().required().error(() => {
            return {
                message: 'Check your inputs.',
            };
        }),
    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    console.log("Controller got called");
    employeeService.create(req.body)
        .then(employee => res.json(employee))
        .catch(next);
}

function NotifyOnRegistrtionEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function countEmployee(req, res, next) {
    employeeService.countEmployee()
        .then(employee => res.json(employee))
        .catch(next);
}

function countNewEmployee(req, res, next) {
    employeeService.countNewEmployee()
        .then(employee => res.json(employee))
        .catch(next);
}


/* -------------------------------//
Get All Employee
// ------------------------------ */

function getAll(req, res, next) {
    employeeService.getAll()
        .then(employees => res.json(employees))
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

    employeeService.getById(req.params.id)
        .then(employee => employee ? res.json(employee) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({
        employeeName: Joi.string().required(),
        employeeEmail: Joi.string().required(),
        employeePhone: Joi.string().required(),
        employeeAltPhone: Joi.string().required(),
        jobId: Joi.string().required(),
        KRA_Pin: Joi.string().required(),
        jobGroup: Joi.string().required(),
        National_Id: Joi.string().required(),
        requestAs: Joi.string().required(),
        Status: Joi.string().required(),
        approvalStatus: Joi.string().required(),
        employeeForeignId: Joi.string().required().error(() => {
            return {
                message: 'Check your inputs.',
            };
        }),
    });
    validateRequest(req, next, schema);
}


function update(req, res, next) {
    // users can update their own account and admins can update any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    employeeService.update(req.params.id, req.body)
        .then(employee => res.json(employee))
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

    employeeService.delete(req.params.id)
        .then(() => res.json({ message: 'Employee deleted successfully' }))
        .catch(next);
}
