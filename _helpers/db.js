const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('accounts/account.model'),
    RefreshToken: require('accounts/refresh-token.model'),
    Employee: require('Components/EmployeesComponent/Employee.model'),
    Staffs: require('Components/StaffsComponent/Staff.model'),
    Requests: require('Components/RequestsComponent/Request.model'),
    Vendors: require('Components/VendorsComponent/Vendor.model'),
    Suppliers: require('Components/SuppliersComponent/Supplier.model'),
    Categories: require('Components/StoreComponent/CategoriesComponent/Category.model'),
    Items: require('Components/StoreComponent/ItemsComponent/Item.model'),
    Tenders: require('Components/TendersComponent/Tender.model'),


    Invoices: require('Components/InvoicesComponent/Invoice.model'),
    isValidId 
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}