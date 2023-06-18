const http = require("http")
require("dotenv").config();

const { mongoConnect } = require("./services/mongo");

const { loadPlanets } = require("./models/planets.model");
const { loadLaunches } = require("./models/launches.model");

const app = require("./app")

const PORT = process.env.PORT || 8000;

const server = http.createServer(app)

async function startServer(){
  await mongoConnect();
  await loadPlanets;
  await loadLaunches();
  server.listen(PORT, () => {
    console.log("listening on PORT:", PORT); 
  });
}

startServer() 
 