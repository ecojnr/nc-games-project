const db = require("../db/connection");

exports.selectReviews = () => {
  return db
    .query(
      "SELECT reviews.review_id, COUNT(comments.review_id) AS comment_count, title, owner, category, review_img_url, reviews.created_at, reviews.votes, designer FROM comments INNER JOIN reviews ON comments.review_id=reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.review_id ASC;"
    )
    .then((result) => result.rows);
};
exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => result.rows);
};

exports.selectReviewById = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: `Entered ID is not a number: ${id}`,
    });
  }
  return db
    .query(
      "SELECT users.username as owner, reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, categories.slug AS category, created_at FROM reviews INNER JOIN users ON users.username=reviews.owner INNER JOIN categories ON categories.slug=reviews.category WHERE review_id = $1;",
      [id]
    )
    .then((review) => {
      review = review.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review id: ${id}`,
        });
      }
      return review;
    });
};

exports.selectCommentsByReview = (id) => {
  if (isNaN(id)) {
    return Promise.reject({
      status: 400,
      msg: `Entered ID is not a number: ${id}`,
    });
  }
  return db
    .query("SELECT * FROM comments WHERE review_id = $1;", [id])
    .then((review) => {
      review = review.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for review id: ${id}`,
        });
      }
      return review;
    });
};
