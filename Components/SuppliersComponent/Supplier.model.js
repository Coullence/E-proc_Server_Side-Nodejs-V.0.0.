const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    supplierCompany:   {type:String, require:true},
    supplierPin: 	   {type:String, require:true},
    supplierEmail:     {type:String, require:true},
    supplierPhone:     {type:String, require:true},
    supplierAdress:    {type:String, require:true},
    supplierLocation:  {type:String, require:true},
    supplierCategory:  {type:String, require:true},
    quotation:         {type:String, require:true},
    Status: 	       {type:String, require:true}, 
    userForeignId:     {type:String, required:true},

}, {timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Suppliers', schema);