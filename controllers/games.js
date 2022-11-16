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
