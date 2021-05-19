require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
// app.use(cors({ origin: (origin, callback) => callback(null, true)}));

// api routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/employees', require('./Components/EmployeesComponent/Employee.controller'));
app.use('/staffs', require('./Components/StaffsComponent/Staff.controller'));
app.use('/requests', require('./Components/RequestsComponent/Request.controller'));
app.use('/vendors', require('./Components/VendorsComponent/Vendor.controller'));
app.use('/suppliers', require('./Components/SuppliersComponent/Supplier.controller'));
app.use('/invoices', require('./Components/InvoicesComponent/Invoice.controller'));
app.use('/categories', require('./Components/StoreComponent/CategoriesComponent/Category.controller'));
app.use('/items', require('./Components/StoreComponent/ItemsComponent/Item.controller'));
app.use('/tenders', require('./Components/TendersComponent/Tender.controller'));
// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
