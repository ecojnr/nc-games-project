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
    .query("SELECT * FROM reviews WHERE review_id = $1;", [id])
    .then((result) => {
      const review = result.rows[0];
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
    .then((result) => {
      const comments = result.rows;
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for review_id: ${id}`,
        });
      }
      return comments;
    });
};

exports.insertComment = (newComment) => {
  const { body, review_id, created_at, votes, author } = newComment;

  if (!(typeof review_id === "number" && typeof votes === "number")) {
    return Promise.reject({
      status: 400,
      msg: `Review ID or votes is not a number`,
    });
  } else if (
    typeof newComment.body !== "string" &&
    typeof newComment.author !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: `The body, time or author is not a string.`,
    });
  }
  return db
    .query(
      "INSERT INTO comments (body, review_id, author, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [body, review_id, author, votes, created_at]
    )
    .then(({ rows }) => rows[0]);
};
