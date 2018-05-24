const jwt = require('jsonwebtoken');
const Mailer = require('../mailer');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { jwtSecret } = require('../config');

const User = mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    // validate email on the client side.
  },
  email_confirmed: Boolean,
  email_confirmation_token: String,
  password_digest: {
    type: String,
    required: true,
  },
});

class UserClass {
  privateJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      email_confirmed: this.email_confirmed,
    };
  }

  publicJson() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  generateJwt() {
    const payload = { sub: this.id };
    return jwt.sign(payload, jwtSecret);
  }

  sendEmailConfirmationMessage() {
    const mailer = new Mailer();

    mailer
      .deliver(
        'email-confirmation',
        { to: this.email, subject: 'Email confirmation' },
        { token: this.email_confirmation_token, id: this.id },
      )
      .catch(error => console.log(error));
  }
}

User.plugin(uniqueValidator);
User.loadClass(UserClass);

module.exports = mongoose.model('User', User);
