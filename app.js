const express = require("express");

const controllers = require("../nc-games-project/controllers/games");

const app = express();

app.use(express.json());

app.get("/api/reviews", controllers.getReviews);
app.get("/api/categories", controllers.getCategories);
app.get("/api/reviews/:review_id", controllers.getReviewById);
app.get("/api/reviews/:review_id/comments", controllers.getCommentsByReview);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = app;
