const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");

afterAll(() => db.end());

describe("1: GET /api/reviews", () => {
	test("The url responds with a status of 200", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeInstanceOf(Array);
			});
	});
});
