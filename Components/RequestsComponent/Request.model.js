const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    itemCategory: { type: String, required: true },
    requestedItem: { type: String, required: true },
    itemQuantity: { type: String, required: true },
    requestStatus: { type: String },
    Status: { type: String },
    staffForeignId: { type: String, required: true },
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });





schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Requests', schema);