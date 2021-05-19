const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const accountService = require('./account.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
router.post('/reset-password', resetPasswordSchema, resetPassword);
// router.get('/', authorize(Role.Admin), getAll);

// router.get('/', getAll); 
// router.get('/:id', authorize(), getById);
// router.post('/', authorize(Role.Admin), createSchema, create);
// router.put('/:id',  authorize([Role.Admin, Role.Authenticated, Role.Staff, Role.Supplier, Role.Vendor]),  updateSchema, update);
// router.delete('/:id', authorize(), _delete);

router.get('/', getAll); 

router.get('/staffs', getStaffs);
router.get('/vendors', getAllVendors);
router.get('/staffs/count', countStaffs);
router.get('/new/count', countNew);

router.get('/suppliers', getAllSuppliers);
router.get('/employees', getAllEmployee); 
router.get('/authenticated', getAllAuthenticated); 

router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

 


module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({ email, password, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    accountService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({

      firstName:        Joi.string().required(),
      lastName:         Joi.string().required(),
      email:            Joi.string().email().required(),
      phone:            Joi.required(),
      National_Id:      Joi.required(),
      jobGroup:         Joi.string().required(),
      jobId:            Joi.string().required(),
      requestAs:        Joi.string().required(),
      requestStatus:    Joi.string().required(),
      Status:           Joi.string().required(),
      acceptTerms:      Joi.boolean().valid(true).required(),
      role:             Joi.string().required(),
      password:         Joi.string().min(6).required(),
      confirmPassword:  Joi.string().valid(Joi.ref('password')).required(),


    itemName:            Joi.string(),
    itemCategory:        Joi.string(),
    itemQuantity:        Joi.string(),
    unitPrice:           Joi.string(),
    

        // title: Joi.string().required(),
        // firstName: Joi.string().required(),
        // lastName: Joi.string().required(),
        // email: Joi.string().email().required(),
        // password: Joi.string().min(6).required(),
        // confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        // acceptTerms: Joi.boolean().valid(true).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    accountService.register(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
        .catch(next);
        console.log("got called reg service")
}

function verifyEmailSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
    console.log("got called for verification");
    accountService.verifyEmail(req.body)
        .then(() => res.json({ message: 'Verification successful, you can now login' }))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    accountService.forgotPassword(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
        .catch(next);
}

function validateResetTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
    accountService.validateResetToken(req.body)
        .then(() => res.json({ message: 'Token is valid' }))
        .catch(next);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
    accountService.resetPassword(req.body)
        .then(() => res.json({ message: 'Password reset successful, you can now login' }))
        .catch(next);
}


function getAll(req, res, next) {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

// /////////////////////////////////////
// get Staff
function getAllStaff(req, res, next) {
  console.log("git called!");
    accountService.getAllStaff()
        .then(accounts => res.json(accounts))
        .catch(next);
}
// get Staff getAllVendors
function getAllVendors(req, res, next) {
      accountService.getAllVendors()
          .then(accounts => res.json(accounts))
          .catch(next);
  }
  function getStaffs(req, res, next) {
    accountService.getStaffs()
        .then(accounts => res.json(accounts))
        .catch(next);
}
  // get Staff countNew
function countStaffs(req, res, next) {
      accountService.countStaffs()
          .then(accounts => res.json(accounts))
          .catch(next);
  }

function countNew(req, res, next) {
    accountService.countNew()
        .then(accounts => res.json(accounts))
        .catch(next);
}
// get Suppliers
function getAllSuppliers(req, res, next) {
    accountService.getAllSuppliers()
        .then(accounts => res.json(accounts))
        .catch(next);
}
// get Employee
function getAllEmployee(req, res, next) {
    accountService.getAllEmployee()
        .then(accounts => res.json(accounts))
        .catch(next);
}
// get Authenticated
function getAllAuthenticated(req, res, next) {
    accountService.getAllAuthenticated()
        .then(accounts => res.json(accounts))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own account and admins can get any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    accountService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({


          firstName:        Joi.string().required(),
          lastName:         Joi.string().required(),
          email:            Joi.string().email().required(),
          phone:            Joi.required(),
          National_Id:      Joi.required(), 
          jobGroup:         Joi.string().required(),
          jobId:            Joi.string().required(),
          requestAs:        Joi.string().required(),
          requestStatus:    Joi.string().required(),
          Status:           Joi.string().required(),
          acceptTerms:      Joi.boolean().valid(true).required(),
          role:             Joi.string().required(),
          password:         Joi.string().min(6).required(),
          confirmPassword: Joi.string().valid(Joi.ref('password')).required().error(() => 'Password Missmatch'),


    itemName:            Joi.string(),
    itemCategory:        Joi.string(),
    itemQuantity:        Joi.string(),
    unitPrice:           Joi.string(),
       
    //     title: Joi.string().required(),
    //     firstName: Joi.string().required(),
    //     lastName: Joi.string().required(),
    //     email: Joi.string().email().required(),
    //     password: Joi.string().error(() => {
    //   return {
    //     message: 'Check your inputs.',
    //   };
    // }),
    //     confirmPassword: Joi.string().valid(Joi.ref('password')).required().error(() => 'Password Missmatch'),
    //     role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    accountService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {


      firstName:        Joi.string().empty(''),
      lastName:         Joi.string().empty(''),
      email:            Joi.string().email().empty(''),
      phone:            Joi.string().empty(''),
      National_Id:      Joi.string().empty(''),
      jobGroup:         Joi.string().empty(''),
      jobId:            Joi.string().empty(''),
      requestAs:        Joi.string().empty(''),
      requestStatus:    Joi.string().empty(''),
      Status:           Joi.string().empty(''),
      acceptTerms:      Joi.boolean().valid(true).empty(''),
      role:             Joi.string().empty(''),
      password:         Joi.string().min(6).empty(''),
      confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),


    itemName:            Joi.string().empty(''),
    itemCategory:        Joi.string().empty(''),
    itemQuantity:        Joi.string().empty(''),
    unitPrice:           Joi.string().empty(''),
   




        // title: Joi.string().empty(''),
        // firstName: Joi.string().empty(''),
        // lastName: Joi.string().empty(''),
        // email: Joi.string().email().empty(''), 
        // password: Joi.string().min(6).empty(''),
        // role: Joi.string().empty(''),
        // approvalStatus: Joi.string().empty(''),
        // confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    };

    // only admins can update role
    // if (req.user.role === Role.Admin) {
    //     schemaRules.role = Joi.string().empty('');
    // }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own account and admins can update any account
    
    //  if (req.params.id === req.user.id ) {
    // accountService.update(req.params.id, req.body)
    //     .then(account => res.json(account))
    //     .catch(next);
    // }else if (req.user.role === Role.Admin ) {
    // accountService.update(req.params.id, req.body)
    //     .then(account => res.json(account))
    //     .catch(next);
    // }else if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }


    accountService.update(req.params.id, req.body)
        .then(account => res.json({ message: 'Account Updated successfully' }))
        .catch(next);
        
    console.log("Request.params", req.body);
        
    console.log("controller service got called!",req.params.id);
}

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    // if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    accountService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}

// helper functions

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}