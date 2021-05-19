const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

      firstName:        { type: String, required: true },
      lastName:         { type: String, required: true },
      email:            { type: String, unique: true, required: true },
      phone:            { type: String, required: true },
      National_Id:      { type: String, required: true },
      jobGroup:         { type: String, required: true },
      jobId:            { type: String, required: true },
      requestAs:        { type: String, required: true },
      requestStatus:    { type: String, required: true },
      Status:           { type: String, required: true },

    itemName:           { type: String, default:"null"},
    itemCategory:       { type: String, default:"null"},
    itemQuantity:       { type: String, default:"null"},
    unitPrice:          { type: String, default:"null"},


      acceptTerms: Boolean,
      role:             { type: String, required: true },
      passwordHash:     { type: String, required: true },
      verificationToken: String,
      verified: Date,
      resetToken: {
            token: String,
            expires: Date
        },
      passwordReset: Date,

    // email: { type: String, unique: true, required: true },
    // passwordHash: { type: String, required: true },
    // title: { type: String, required: true },
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    // acceptTerms: Boolean,
    // role: { type: String, required: true },
    // verificationToken: String,
    // verified: Date,
    // resetToken: {
    //     token: String,
    //     expires: Date
    // },
    // passwordReset: Date,
    // // created: { type: Date, default: Date.now },
    // // updated: Date
}, {timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }});

schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

module.exports = mongoose.model('Account', schema);