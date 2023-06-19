const request = require("supertest");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanets } = require("../../models/planets.model");
 
const app = require("../../app");

describe("Launch Tests", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanets;
  }, 100000);

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should pass with 200 status", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const launchData = {
      mission: "Chicken Invasion",
      target: "Kepler-296 f",
      launchDate: "January 1, 1988",
      rocket: "Vert Mission 0",
    };

    test("It should pass with 201 status", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        ...launchData,
        launchDate: new Date(launchData.launchDate).toISOString(),
      });
    });

    test("It should catch missing launch property", async () => {
      const dataWithoutProp = { ...launchData };
      delete dataWithoutProp.launchDate;
      const response = await request(app)
        .post("/v1/launches")
        .send(dataWithoutProp)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({ ...launchData, launchDate: "zazoo" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
})
