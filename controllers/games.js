const { error } = require("console");
const models = require("../models/games.js");

exports.getReviews = (req, res) => {
  models.selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getCategories = (req, res) => {
  models.selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewById = (req, res, next) => {
  models
    .selectReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReview = (req, res, next) => {
  models
    .selectCommentsByReview(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  models
    .insertComment(req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  models
    .selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.upVote = (req, res, next) => {
  models
    .updateVotebyNumber(req.params.review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
