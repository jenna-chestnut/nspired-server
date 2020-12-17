/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const Fixtures = require("./nSpired.fixtures");

describe("Win wall endpoints", () => {
  
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
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  before("clean the table", () => Fixtures.cleanTables(db));

  after("disconnect from db", () => db.destroy());

  afterEach("cleanup", () => Fixtures.cleanTables(db));

  describe("GET /win-wall", () => {
    context(`Given no goals`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/win-wall").expect(200, []);
      });
    });

    context("Given there are goals in the database", () => {

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });


      it("responds with 200 and all public articles, sorted by most upvotes", () => {
        return supertest(app).get("/api/win-wall").expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property("id");
            expect(res.body[0]).to.have.property("goal_name");
            res.body.forEach((result, idx) => {
              if (idx !==0 ) {
                const upvotes = parseInt(result.upvote_count);
                expect(upvotes)
                  .to.be.at.most(parseInt(res.body[idx - 1].upvote_count));
              }});
          });
      });
    });
  });
});
