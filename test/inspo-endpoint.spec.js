/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const Fixtures = require("./nSpired.fixtures");

describe("Inspo endpoint", () => {
  
  let db;

  const {
    testInspo
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

  describe("GET /inspo", () => {
    context(`Given no goals`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/inspo").expect(200, []);
      });
    });

    context("Given there are goals in the database", () => {

      beforeEach("insert stuff", () => {
        return Fixtures.seedStuff(
          db, testInspo, 'inspo'
        );
      });


      it("responds with 200 and all inspo", () => {
        return supertest(app).get("/api/inspo").expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.eql(testInspo);
          });
      });
    });
  });
});
