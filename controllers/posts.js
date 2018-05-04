const mongoose = require('mongoose');

const Post = require('../models/post');

exports.before_id_param = (req, res, next, id) => {
  Post.findById(id)
    .populate({
      path: 'user',
      select: 'name',
    })
    .exec()
    .then((doc) => {
      if (!doc) res.status(404).end();
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
  res.status(200).json({ post: req.post });
};

exports.create = (req, res, next) => {
  const params = {
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    user: req.userId,
  };

  Post.create(params)
    .then((obj) => {
      res.status(201).json({ obj });
    })
    .catch(next);
};

exports.update = (req, res, next) => {
  if (req.userId !== req.post.user.id) res.status(403).end();

  Post
    .findByIdAndUpdate(
      req.post.id,
      { $set: req.body },
      { new: true, runValidators: true },
    )
    .then((doc) => {
      res.status(200).json({ post: doc });
    })
    .catch(next);
};

exports.delete = (req, res, next) => {
  if (req.userId !== req.post.user.id) res.status(403).end();

  req.post
    .remove()
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
