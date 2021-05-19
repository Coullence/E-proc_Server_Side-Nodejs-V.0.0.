const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    categoryName: { type: String, unique: true, required: true },
    Status: { type: String },
    supplierForeignId: { type: String},
    itemForeignId: { type: String},
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });





schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Categories', schema);