/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const Fixtures = require("./nSpired.fixtures");

describe("Upvote endpoints", () => {
  
  let db;

  const {
    testUsers,
    testGoals,
    testUpVotes,
    testUserGoals,
    testAdvice
  } = Fixtures.makeNSpiredFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  before("clean the table", () => Fixtures.cleanTables(db));

  after("disconnect from db", () => db.destroy());

  afterEach("cleanup", () => Fixtures.cleanTables(db));

  describe("GET /upvotes/:goalId", () => {
    context("Given there are goals/upvotes in the database", () => {

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });
      
      it(`responds with 404 goal not found if invalid link`, () => {
        return supertest(app).get("/api/upvotes/00000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: 'Goal does not exist'}
          });
      });
  

      it("responds with 200 and the goal's upvotes, including a note of whether the user has upvoted for rendering purposes if someone is logged in", () => {
        return supertest(app).get(`/api/upvotes/${testGoals[0].id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then(res => {
            expect(res.body).to.have.property('upvotes');
            expect(res.body).to.have.property('userUpvoted');
          });
      });
    });
  });

  describe("POST /upvotes/:goalId", () => {
    context("Given there are goals/upvotes in the database", () => {
      
      const goal_id = testGoals[0].id;

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });

      
      it(`responds with 404 goal not found if invalid link`, () => {
        return supertest(app).post("/api/upvotes/00000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .send({ goal_id })
          .expect(404, {
            error: { message: 'Goal does not exist'}
          });
      });
  

      it("responds with 201 upvote that was added", () => {
        return supertest(app).post(`/api/upvotes/${goal_id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .send({})
          .expect(201)
          .then(res => {
            expect(res.body.goal_id).to.eql(goal_id);
            expect(res.body.user_id).to.eql(testUsers[0].id);
          });
      });
    });
  });
  describe("DELETE /upvotes/:goalId", () => {
    context("Given there are goals/upvotes in the database", () => {
      
      const goal_id = testGoals[0].id;

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });
      
      
      it(`responds with 404 goal not found if invalid link`, () => {
        return supertest(app).delete("/api/upvotes/00000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: 'Goal does not exist'}
          });
      });
  

      it("responds with 204 and successfully deletes user upvote", () => {
        return supertest(app).delete(`/api/upvotes/${goal_id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .send({})
          .expect(204)
          .then(() => {
            return supertest(app).get(`/api/upvotes/${goal_id}`)
              .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
              .expect(200)
              .then(res => {
                expect(res.body.userUpvoted).to.eql(false);
              });
          });
      });
    });
  });
});
