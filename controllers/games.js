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

exports.getCommentsByReview = (req, res) => {
  models.selectCommentsByReview(req.params.review_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
