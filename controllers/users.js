const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.get = (req, res, next) => {
  let attributes;
  if (req.userId === req.params.id) attributes = 'name email';
  else attributes = 'name';

  User.findById(req.params.id)
    .select(attributes)
    .exec()
    .then((doc) => {
      if (doc) res.status(200).json({ user: doc });
      res.status(404).end();
    })
    .catch(next);
};

exports.create = (req, res, next) => {
  const params = {
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    name: req.body.name,
  };

  bcrypt.hash(req.body.password, 10).then((hash) => {
    params.password_digest = hash;

    User
      .create(params)
      .then((obj) => {
        res.status(201).json({ obj });
      })
      .catch(next);
  });
};

exports.update = (req, res, next) => {
  const { id } = req.params;
  if (req.userId !== id) res.status(403).end();

  User
    .findByIdAndUpdate(
      id,
      { $set: { name: req.body.name } },
      { new: true, runValidators: true },
    )
    .then((doc) => {
      res.status(200).json({ user: doc });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) res.status(400).end();

      bcrypt.compare(password, user.password_digest).then((match) => {
        if (match) {
          const payload = { sub: user.id };
          const token = jwt.sign(payload, jwtSecret);
          res.json({ message: 'ok', token });
          return;
        }

        res.status(400).end();
      });
    })
    .catch(next);
};
