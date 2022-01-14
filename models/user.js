const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  verified: {
    type: Boolean
  }
}, {
  timestamps: true // created_at / updated_at
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);