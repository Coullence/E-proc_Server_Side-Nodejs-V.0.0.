const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    // tender itemName
    // tender period
    // expected start Date
    // conditions


    tenderStatus:       { type: String},
    categoryForeignId:  { type: String},
    itemName:           { type: String},
    itemCategory:       { type: String, default:"null" },
    itemQuantity:       { type: String},
    dueDate:            { type: String },
    vendorQuotation:    { type: String, default:"null" },
    vendorForeignId:    { type: String, default:"null" },
    unitPricing:        { type: String, default:"null" },
    supplierId:         { type: String, default:"null" },

}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });

 



schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Tenders', schema);