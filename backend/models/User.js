const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  occupation: String,
  city: String,
  state: String,
  phone: String,
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)