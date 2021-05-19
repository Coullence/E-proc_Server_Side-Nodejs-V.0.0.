const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    itemName: { type: String, unique: true, required: true },
    itemQuantity: { type: String, required: true },
    Status: { type: String },
    expectedDate: { type: String, required: true },
    categoryForeignId: { type: String, required: true },
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });





schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Items', schema);