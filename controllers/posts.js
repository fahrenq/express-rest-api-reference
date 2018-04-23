const mongoose = require('mongoose');

const Post = require('../models/post');

exports.before_id_param = (req, res, next, id) => {
  Post.findById(id)
    .exec()
    .then((doc) => {
      req.post = doc;
      next();
    })
    .catch(next);
};

exports.index = (req, res, next) => {
  Post.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        posts: docs,
      };
      res.status(200).json(response);
    })
    .catch(next);
};

exports.get = (req, res) => {
  if (req.post) res.status(200).json({ post: req.post });
  res.status(404).end();
};

exports.create = (req, res, next) => {
  const params = {
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
  };

  Post.create(params)
    .then((obj) => {
      res.status(201).json({ obj });
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  req.post
    .update({ $set: req.body }, { runValidators: true })
    .then((doc) => {
      res.status(200).json({ post: doc });
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  req.post
    .remove()
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
