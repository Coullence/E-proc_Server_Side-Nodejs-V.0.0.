const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    vendorCompany:   {type:String, require:true},
    vendorPin: 	     {type:String, require:true},
    vendorEmail:     {type:String, require:true},
    vendorPhone:     {type:String, require:true},
    vendorAdress:    {type:String, require:true},
    vendorLocation:  {type:String, require:true},
    vendorCategory:  {type:String, require:true},
    quotation:       {type:String, require:true},
    Status: 	     {type:String, require:true}, 

}, {timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }});




schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Vendors', schema);