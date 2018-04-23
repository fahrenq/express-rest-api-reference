const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const User = require('../models/user');

exports.create = (req, res, next) => {
  const params = {
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
  };

  User.create(params)
    .then((obj) => {
      res.status(201).json({ obj });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) res.status(400).end();

      // Change to BCRYPT
      if (user.password === password) {
        const payload = { sub: user.id };
        const token = jwt.sign(payload, jwtSecret);
        res.json({ message: 'ok', token });
      } else {
        res.status(400).end();
      }
    })
    .catch(next);
};
