const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const User = require('../models/user');

exports.get = (req, res, next) => {
  User.findById(req.params.id)
    .exec()
    .then((doc) => {
      if (!doc) {
        res.status(404).end();
        return;
      }

      let user;
      if (req.userId === doc.id) user = doc.privateJson();
      else user = doc.publicJson();

      res.status(200).json({ user });
    })
    .catch(next);
};

exports.create = (req, res, next) => {
  const params = {
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    name: req.body.name,

    // Delete if email confirmation is not necessary
    email_confirmed: false,
    email_confirmation_token: crypto.randomBytes(32).toString('hex'),
  };

  bcrypt.hash(req.body.password, 10).then((hash) => {
    params.password_digest = hash;

    User
      .create(params)
      .then((doc) => {
        doc.sendEmailConfirmationMessage();

        res.status(201).json({
          token: doc.generateJwt(),
          user: doc.privateJson(),
        });
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
      res.status(200).json({ user: doc.privateJson() });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((doc) => {
      if (!doc) res.status(400).end();

      bcrypt.compare(password, doc.password_digest).then((match) => {
        if (match) {
          res.json({
            token: doc.generateJwt(),
            user: doc.privateJson(),
          });
          return;
        }

        res.status(400).end();
      });
    })
    .catch(next);
};

exports.confirmEmail = (req, res, next) => {
  const { id } = req.params;
  const { token } = req.body;

  const query = { _id: id, email_confirmation_token: token };

  User
    .findOneAndUpdate(
      query,
      {
        $set: {
          email_confirmed: true,
          email_confirmation_token: null,
        },
      },
    )
    .then((doc) => {
      if (!doc) res.status(404).end();
      res.status(200).end();
    })
    .catch(next);
};

exports.resedEmailConfirmation = (req, res, next) => {
  const { id } = req.params;

  User
    .findById(id)
    .exec()
    .then((doc) => {
      if (!doc) res.status(404).end();
      if (doc.email_confirmed) {
        res.status(409).json({ message: 'Email is already confirmed' });
        return;
      }

      doc.sendEmailConfirmationMessage();
      res.status(204).end();
    }).catch(next);
};
