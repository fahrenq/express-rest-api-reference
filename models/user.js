const mongoose = require('mongoose');

const User = mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: String,
});

module.exports = mongoose.model('User', User);
