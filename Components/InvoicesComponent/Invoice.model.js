const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    supplierCompany: { type: String },
    supplierEmail: { type: String },
    supplierPhone: { type: String },
    itemCategory: { type: String },
    item: { type: String },
    itemQuantity: { type: String },
    itemUnitPrice: { type: String },
    Total: { type: Number },
    dateExpected: { type: String },
    Status: { type: String },
    supplierForeignId: { type: String },




}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });





schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Invoices', schema);