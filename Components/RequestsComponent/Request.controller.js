const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const requestService = require('./Request.service');

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

router.get('/count',  countRequests);
router.get('/count/new',  countNewRequests);


router.get('/approved',  getApproved);


router.get('/rejected',  getRejected);


router.get('/procured',  getProcured);

// Read by ID  
router.get('/byStaffId:id', getRequestByStaffId);
router.get('/approved/byStaffId:id', getApprovedRequestByStaffId);
router.get('/rejected/byStaffId:id', getRejectedRequestByStaffId);

router.get('/:id', getById);
// update 
router.put('/:id', updateSchema, update);
// Delete
router.delete('/:id', _delete);





module.exports = router;




/* -------------------------------//
Create New Employee
// ------------------------------ */

function createSchema(req, res, next) {
    const schema = Joi.object({


        itemCategory: Joi.string().required(),
        requestedItem: Joi.string().required(),
        itemQuantity: Joi.string().required(),
        requestStatus: Joi.string().required(),
        Status: Joi.string().required(),
        staffForeignId:Joi.string().required(),

    });
    validateRequest(req, next, schema);
}


function create(req, res, next) {
    requestService.create(req.body)
        .then(request => res.json(request))
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
    requestService.getAll()
        .then(request => res.json(request))
        .catch(next);
}
    

function countRequests(req, res, next) {
    requestService.countRequests()
        .then(request => res.json(request))
        .catch(next);
}

function countNewRequests(req, res, next) {
    requestService.countNewRequests()
        .then(request => res.json(request))
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

    requestService.getById(req.params.id)
        .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}

function  getApproved(req, res, next) {
    requestService.getApproved()
    .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);

}function  getRejected(req, res, next) {
    requestService.getRejected()
    .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}function  getProcured(req, res, next) {
    requestService.getProcured()
    .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);

}

function  getRequestByStaffId(req, res, next) {
    requestService.getRequestByStaffId(req.params.id)
    .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}
function  getApprovedRequestByStaffId(req, res, next) {
    requestService.getApprovedRequestByStaffId(req.params.id)
    .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}
function  getRejectedRequestByStaffId(req, res, next) {
    requestService.getRejectedRequestByStaffId(req.params.id)
    .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}




/* -------------------------------//
Update Employee
// ------------------------------ */

function updateSchema(req, res, next) {
    const schema = Joi.object({


        itemCategory: Joi.string(),
        requestedItem: Joi.string(),
        itemQuantity: Joi.string(),
        requestStatus: Joi.string(),
        Status: Joi.string(),
        staffForeignId:Joi.string(),

    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {
    console.log("Got called");


    // users can update their own account and admins can update any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    requestService.update(req.params.id, req.body)
        .then(staff => res.json({ message: 'Data Updated successfully' }))
        .catch(next);

}




/* -------------------------------//
Remove  Request
// ------------------------------ */

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    requestService.delete(req.params.id)
        .then(() => res.json({ message: 'Data deleted successfully' }))
        .catch(next);
}
