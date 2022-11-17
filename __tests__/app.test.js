const { expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");

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

/*describe("4: GET /api/:review_id/comments", () => {
  test("status:200, responds with an array of comments", () => {
    const review_id = 1;
    return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toEqual(
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
});*/
