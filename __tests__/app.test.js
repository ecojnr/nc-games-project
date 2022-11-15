const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");

afterAll(() => db.end());

describe("1: GET /api/reviews", () => {
	test("The url responds with a status of 200", () => {
		return request(app).get("/api/reviews").expect(200);
	});
	test("Responds with a status of 200 and an instance of an array", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeInstanceOf(Array);
			});
	});
	test("status:200, responds with an array of reviews ", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
				expect(reviews).toBeInstanceOf(Array);
				reviews.forEach((review) => {
					expect(review).toEqual(
						expect.objectContaining({
							title: expect.any(String),
							designer: expect.any(String),
							owner: expect.any(String),
							review_img_url: expect.any(String),
							review_body: expect.any(String),
							review_id: expect.any(Number),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
						})
					);
				});
			});
	});
});

describe("2: GET /api/categories", () => {
	test("The url responds with a status of 200", () => {
		return request(app).get("/api/categories").expect(200);
	});
	test("Responds with a status of 200 and an instance of an array", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				const { categories } = body;
				expect(categories).toBeInstanceOf(Array);
			});
	});
	test("status:200, responds with an array of reviews ", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				const { categories } = body;
				expect(categories).toBeInstanceOf(Array);
				categories.forEach((category) => {
					expect(category).toEqual(
						expect.objectContaining({
							slug: expect.any(String),
							description: expect.any(String),
						})
					);
				});
			});
	});
});
