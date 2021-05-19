const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const staffService = require('./Staff.service');

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


router.get('/count',  countStaffs);
router.get('/count/new',  countNewStaffs);

module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({


      staffFirstName: Joi.string().required(),
      staffLastName: Joi.string().required(),
      staffEmail:  Joi.string().required(),
      staffPhone:  Joi.string().required(),
      jobId:  Joi.string().required(),
      KRA_Pin:  Joi.string().required(),
      jobGroup:  Joi.string().required(),
      National_Id:  Joi.string().required(),
      requestAs:  Joi.string().required(),
      Status:  Joi.string().required(),
      approvalStatus: Joi.string().required(),
      staffForeignId:  Joi.string().required().error(() => {
            return {
                message: 'Check your inputs.',
            };
        }),
    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    staffService.create(req.body)
        .then(staff => res.json(staff))
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
    staffService.getAll()
        .then(staffs => res.json(staffs))
        .catch(next);
}

function countStaffs(req, res, next) {
    staffService.countStaffs()
        .then(staff => res.json(staff))
        .catch(next);
}

function countNewStaffs(req, res, next) {
    staffService.countNewStaffs()
        .then(staff => res.json(staff))
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

    staffService.getById(req.params.id)
        .then(staff => staff ? res.json(staff) : res.sendStatus(404))
        .catch(next);
}



/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({

      staffFirstName: Joi.string().required(),
      staffLastName: Joi.string().required(),
      staffEmail:  Joi.string().required(),
      staffPhone:  Joi.string().required(),
      jobId:  Joi.string().required(),
      KRA_Pin:  Joi.string().required(),
      jobGroup:  Joi.string().required(),
      National_Id:  Joi.string().required(),
      requestAs:  Joi.string().required(),
      Status:  Joi.string().required(),
      approvalStatus: Joi.string().required(),
      staffForeignId:  Joi.string().required().error(() => {
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

    staffService.update(req.params.id, req.body)
        .then(staff => res.json({ message: 'Data Updated successfully' }))
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

    staffService.delete(req.params.id)
        .then(() => res.json({ message: 'Staff deleted successfully' }))
        .catch(next);
}
