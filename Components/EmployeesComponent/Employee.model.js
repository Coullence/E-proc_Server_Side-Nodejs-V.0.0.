const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 

    employeeName:       {type:String, required:true},
    employeeEmail:      {type:String, required:true, unique:true},
    employeePhone:      {type:String, required:true, unique:true},
    employeeAltPhone:   {type:String, required:true},
    jobId:              {type:String, required:true, unique:true},
    KRA_Pin:            {type:String, required:true, unique:true},
    jobGroup:           {type:String, required:true},
    National_Id:        {type:String, required:true, unique:true},
    requestAs:          {type:String, required:true},
    Status:             {type:String, required:true},
    approvalStatus:     {type:String, required:true},
    employeeForeignId:  {type:String, required:true},
}, {timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }});



schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Employee', schema);