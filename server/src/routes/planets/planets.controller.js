const { getAllPlanets } = require("../../models/planets.model");

async function httpGetPlanets(req, res) {
  return res.json(await getAllPlanets());
}

module.exports = {
  httpGetPlanets,
};
