const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,

    getAllStaff,
    getAllVendors,
    getAllSuppliers,
    getAllEmployee,
    getStaffs,
    countStaffs,
    countNew,
    getAllAuthenticated
};

async function authenticate({ email, password, ipAddress }) {
    const account = await db.Account.findOne({ email });

    // if (!account || !account.isVerified || !bcrypt.compareSync(password, account.passwordHash)) {
    //     throw 'Email or password is incorrect /n or your account not activated!';
    // }

    if(!account ){

        throw 'Please, you have not created account with this credentials!';
    }
    else if(!account.isVerified){
        throw 'Please, logon to your email to verify Sign-up process!'
    }
    else if(!bcrypt.compareSync(password, account.passwordHash)){
        throw 'Wrong password!'
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { account } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params, origin) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        // return await sendAlreadyRegisteredEmail(params.email, origin);
        throw 'Email has been registered! Please, use another one.';
    }

    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.countDocuments({})) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.Authenticated;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    // send email
    await sendVerificationEmail(account, origin);
    throw 'successfully Registered! Please Check your email for activation link.';
}

async function verifyEmail({ token }) {
    console.log("the token", token);
    const account = await db.Account.findOne({ verificationToken: token });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await db.Account.findOne({ email });

    // always return ok response to prevent email enumeration
    if (!account) throw 'Can not find account with that Email address!';

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24*60*60*1000)
    };
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await db.Account.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';
}

async function resetPassword({ token, password }) {
    const account = await db.Account.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';

    // update password and remove reset token
    account.passwordHash = hash(password);
    account.passwordReset = Date.now();
    account.resetToken = undefined;
    await account.save();
}

async function getAll() {
    const accounts = await db.Account.find();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function getStaffs() {
    const accounts = await db.Account.find({"role":"Staff"});
    return accounts.map(x => basicDetails(x));
}
async function countStaffs() {
    const accounts = await db.Account.count({"role":"Staff"});
    return accounts;
}

async function countNew() {
    const accounts = await db.Account.count({"role":"Authenticated"});
    return accounts;
}




// Get Staff

async function getAllStaff() {
    const accounts = await db.Account.find({"role" : "Staff"});
    return accounts.map(x => basicDetails(x));
}

async function getAllVendors() {
    const accounts = await db.Account.find({"role" : "Vendor"});
    return accounts.map(x => basicDetails(x));
}
// Get Staffs
async function getAllSuppliers() {
    const accounts = await db.Account.find({"role" : "Supplier"});
    return accounts.map(x => basicDetails(x));
}
// Get Employees
async function getAllEmployee() {
    const accounts = await db.Account.find({"role" : "Employee"});
    return accounts.map(x => basicDetails(x));
}
// Get Authenticated
async function getAllAuthenticated() {
    const accounts = await db.Account.find({"role" : "Authenticated"});
    return accounts.map(x => basicDetails(x));
}




async function create(params) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    console.log("Update Params", params); 
    const account = await getAccount(id);
    console.log("account is ", account);

    // validate
    if (account.email !== params.email && await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = hash(params.password);
    }

    // copy params to account and save
    Object.assign(account, params);
    console.log("Params", params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getAccount(id);
    await account.remove();
}

// helper functions

async function getAccount(id) {
    console.log("Get by id", id);
     if (!db.isValidId(id)) throw 'Account not found';
    const account = await db.Account.findById(id);
    if (!account) throw 'Account not found';
    return account;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {


    const { id,
      firstName,
      lastName,
      email,
      phone,
      National_Id, 
      jobGroup,
      jobId,
      requestAs,
      requestStatus,
      Status,
      acceptTerms,
      isVerified, 
      role,

        itemName,
        itemCategory,
        itemQuantity,
        unitPrice,
      
      createdAt,
      updatedAt, 
      } = account;

      return { 
        id,
      firstName,
      lastName,
      email,
      phone,
      National_Id, 
      jobGroup,
      jobId,
      requestAs,
      requestStatus,
      Status,
      acceptTerms,
      isVerified, 
      role,


      itemName,
      itemCategory,
      itemQuantity,
      unitPrice,
      
      createdAt,
      updatedAt,

      };

}

async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/Auth/activate/token/${account.verificationToken}`;
        console.log(verifyUrl);
        message = `<p>Please click the below link to verify your email address:</p>
                   <a href="${verifyUrl}"><button class="btn btn-info btn-sm">Click to Activate</button></a>
                   <p>
                   If you have a problem with button click, copy or click the below link to activate your account.
                   <a href="${verifyUrl}">${verifyUrl}</a></p>
                   `;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Verify Email',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}

async function sendPasswordResetEmail(account, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/Auth/Set_New_Password/token/${account.resetToken.token}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}