const express = require("express");

const controllers = require("../be-nc-games/controllers/games.js");

const app = express();

app.use(express.json());

app.get("/api/reviews", controllers.getReviews);
app.get("/api/categories", controllers.getCategories);

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
	console.log(err);
	res.sendStatus(500);
});

module.exports = app;
