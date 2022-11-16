const db = require("../db/connection");

exports.selectReviews = () => {
	return db
		.query(
			"SELECT title, designer, owner, review_img_url, review_id, category, created_at, votes FROM reviews;"
		)
		.then((result) => result.rows);
};

exports.selectCategories = () => {
	return db.query("SELECT * FROM categories;").then((result) => result.rows);
};
