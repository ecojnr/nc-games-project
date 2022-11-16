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
