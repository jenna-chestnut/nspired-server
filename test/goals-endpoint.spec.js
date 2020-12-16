/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const Fixtures = require("./nSpired.fixtures");

// this endpoint is to view a singular goal 
// IE the personal goal page or public win page
// this is a protected endpoint and requires authorization

describe("Goals endpoints", () => {
  
  let db;

  const {
    testUsers,
    testGoals,
    testUpVotes,
    testAdvice
  } = Fixtures.makeNSpiredFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  before("clean the table", () => Fixtures.cleanTables(db));

  after("disconnect from db", () => db.destroy());

  afterEach("cleanup", () => Fixtures.cleanTables(db));

  describe("GET /goals/:goalId", () => {
    
    beforeEach("insert stuff", () => {
      return Fixtures.seedNSpiredTables(
        db, testUsers, testGoals, testUpVotes, testAdvice
      );
    });

    context(`Given an invalid goal id`, () => {
      it(`responds with 404 not found if invalid id`, () => {
        return supertest(app).get("/api/goals/0000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404,{
            error: `Goal does not exist`
          });
      });

      it(`responds with 400 error if goal Id is string`, () => {
        return supertest(app).get("/api/goals/test")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(400,{
            error: `Goal id must be a number`
          });
      });
    });

    context("Given a correct goal endpoint", () => {
      const goal = testGoals[0];
      const privateGoal = testGoals[3];
      const user = testUsers[privateGoal.user_id - 1];
      const badUser = testUsers[goal.user_id];

      it("responds with 200 and the goal if goal is public", () => {
        return supertest(app).get(`/api/goals/${goal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then(res => {
            expect(res.body.id).to.eql(goal.id);
            expect(res.body.user_id).to.eql(goal.user_id);
            expect(res.body.is_public).to.eql(true);
            expect(res.body.date_created).to.eql(goal.date_created.toISOString());
          });
      });

      it("responds with 401 unauthorized if goal is private and username does not match", () => {
        return supertest(app).get(`/api/goals/${privateGoal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(badUser))
          .expect(401, {
            error: {message: 'Unauthorized request'}
          });
      });

      it("responds with 200 and the goal if goal is private and username matches", () => {
        return supertest(app)
          .get(`/api/goals/${privateGoal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(user))
          .expect(200)
          .then(res => {
            expect(res.body.id).to.eql(privateGoal.id);
            expect(res.body.user_id).to.eql(privateGoal.user_id);
            expect(res.body.is_public).to.eql(false);
            expect(res.body.date_created).to.eql(privateGoal.date_created.toISOString());
          });
      });
    });
  });
});
