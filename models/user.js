const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    // validate email on the client side.
  },
  password_digest: {
    type: String,
    required: true,
  },
});

User.plugin(uniqueValidator);

module.exports = mongoose.model('User', User);
