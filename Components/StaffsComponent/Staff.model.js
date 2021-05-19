const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

      staffFirstName:  { type: String, required: true },
      staffLastName:  { type: String, required: true },
      staffEmail:  { type: String, required: true },
      staffPhone:  { type: String, required: true },
      jobId:  { type: String, required: true },
      KRA_Pin:  { type: String, required: true },
      jobGroup:  { type: String, required: true },
      National_Id:  { type: String, required: true },
      requestAs:  { type: String, required: true },
      Status:  { type: String, required: true },
      approvalStatus: { type: String, required: true },
      staffForeignId:  { type: String, required: true },

}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });





schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Staffs', schema);