const { expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const devData = require("../db/data/development-data/index");

beforeEach(() => {
	return seed(devData);
});
afterAll(() => db.end());

describe("1: GET /api/reviews", () => {
	test("status:200, responds with an array of reviews containing correct object values ", () => {
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
							review_id: expect.any(Number),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(String),
						})
					);
				});
			});
	});
});

describe("2: GET /api/categories", () => {
	test("status:200, responds with an array of categories", () => {
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

describe("3: GET /api/reviews/review_id", () => {
	test("status:200, responds with an array of reviews containing correct object values ", () => {
		const review_id = 1;
		return request(app)
			.get(`/api/reviews/${review_id}`)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toBeInstanceOf(Object);
				expect(body.review).toEqual(
					expect.objectContaining({
						review_id: 1,
						title: expect.any(String),
						review_body: expect.any(String),
						designer: expect.any(String),
						review_img_url: expect.any(String),
						votes: expect.any(Number),
						category: expect.any(String),
						owner: expect.any(String),
						created_at: expect.any(String),
					})
				);
			});
	});
	test("status:404, responds with an error stating no review found for given id", () => {
		return request(app)
			.get("/api/reviews/85")
			.expect(404)
			.then((result) => {
				expect(result.body.msg).toBe(`No review found for review id: 85`);
			});
	});
	test("status:400, responds with an error stating review id is not a number", () => {
		return request(app)
			.get("/api/reviews/asdasd")
			.expect(400)
			.then((result) => {
				expect(result.body.msg).toBe(`Entered ID is not a number: asdasd`);
			});
	});
});

describe("4: GET /api/:review_id/comments", () => {
	test("status:200, responds with an array of comments", () => {
		const review_id = 1;
		return request(app)
			.get(`/api/reviews/${review_id}/comments`)
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toBeInstanceOf(Array);
				expect(comments).toHaveLength(3);
				comments.forEach((comment) => {
					expect(comment).toEqual(
						expect.objectContaining({
							body: expect.any(String),
							review_id: 1,
							created_at: expect.any(String),
							votes: expect.any(Number),
							author: expect.any(String),
							comment_id: expect.any(Number),
						})
					);
				});
			});
	});
	test("status:404, responds with an error stating no review found for given id", () => {
		const review_id = 400;
		return request(app)
			.get(`/api/reviews/${review_id}/comments`)
			.expect(404)
			.then((result) => {
				expect(result.body.msg).toBe(`No comments found for review_id: 400`);
			});
	});
	test("status:400, responds with an error stating review id is not a number", () => {
		return request(app)
			.get("/api/reviews/asdasd/comments")
			.expect(400)
			.then((result) => {
				expect(result.body.msg).toBe(`Entered ID is not a number: asdasd`);
			});
	});
});

describe("5: POST /api/reviews/:review_id/comments", () => {
	test("status: 201, responds with newly added comment", () => {
		const newComment = {
			body: "Test Comment",
			review_id: 1,
			created_at: new Date(),
			votes: 3,
			author: "cooljmessy",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toEqual({
					author: "cooljmessy",
					body: "Test Comment",
					created_at: expect.any(String),
					review_id: 1,
					votes: 3,
					comment_id: expect.any(Number),
				});
			});
	});
	test("status: 400, responds with body is not a string", () => {
		const newComment = {
			body: 2,
			review_id: 2,
			created_at: new Date(),
			votes: 3,
			author: 2,
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(400)
			.then((result) => {
				expect(result.body.msg).toBe(
					`The body, time or author is not a string.`
				);
			});
	});
	test("status: 400, responds with review id is not a number", () => {
		const newComment = {
			body: "Test Comment",
			review_id: "test",
			created_at: new Date(),
			votes: 3,
			author: "cooljmessy",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(400)
			.then((result) => {
				expect(result.body.msg).toBe(`Review ID or votes is not a number`);
			});
	});
});

describe("6: GET /api/users", () => {
	test("status:200, responds with an array of users ", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => {
				const { users } = body;
				expect(users).toBeInstanceOf(Array);
				users.forEach((user) => {
					expect(user).toEqual(
						expect.objectContaining({
							username: expect.any(String),
							name: expect.any(String),
							avatar_url: expect.any(String),
						})
					);
				});
			});
	});
});

describe.only("7: PATCH /api/reviews/:review_id", () => {
	test.only("status: 201, responds with an extra 3 votes for comment", () => {
		const reviewUpdates = {
			votes: 3,
		};
		const review_id = 1;
		return request(app)
			.patch(`/api/reviews/${review_id}`)
			.send(reviewUpdates)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toBeInstanceOf(Object);
				expect(body.review).toEqual(
					expect.objectContaining({
						title: "Culture a Love of Agriculture With Agricola",
						designer: "Uwe Rosenberg",
						owner: "tickle122",
						review_img_url:
							"https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
						review_body:
							"You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
						category: "strategy",
						created_at: expect.any(String),
						votes: 4,
					})
				);
			});
	});
	test.only("status: 201, responds with an extra 100 votes for comment", () => {
		const reviewUpdates = {
			votes: 100,
		};
		const review_id = 1;
		return request(app)
			.patch(`/api/reviews/${review_id}`)
			.send(reviewUpdates)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toBeInstanceOf(Object);
				expect(body.review).toEqual(
					expect.objectContaining({
						title: "Culture a Love of Agriculture With Agricola",
						designer: "Uwe Rosenberg",
						owner: "tickle122",
						review_img_url:
							"https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
						review_body:
							"You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
						category: "strategy",
						created_at: expect.any(String),
						votes: 101,
					})
				);
			});
	});
	test.only("status: 201, responds with 1 less vote for comment", () => {
		const reviewUpdates = {
			votes: -1,
		};
		const review_id = 1;
		return request(app)
			.patch(`/api/reviews/${review_id}`)
			.send(reviewUpdates)
			.expect(200)
			.then(({ body }) => {
				const { review } = body;
				expect(review).toBeInstanceOf(Object);
				expect(body.review).toEqual(
					expect.objectContaining({
						title: "Culture a Love of Agriculture With Agricola",
						designer: "Uwe Rosenberg",
						owner: "tickle122",
						review_img_url:
							"https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
						review_body:
							"You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
						category: "strategy",
						created_at: expect.any(String),
						votes: 0,
					})
				);
			});
	});
	test.only("status: 400, responds with an error stating review id is not a number", () => {
		const review_id = "two";
		return request(app)
			.get(`/api/reviews/${review_id}`)
			.expect(400)
			.then((result) => {
				expect(result.body.msg).toBe(`Entered ID is not a number: two`);
			});
	});
});
