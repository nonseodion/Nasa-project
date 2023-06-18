const express = require("express")

const { httpGetPlanets } = require("./planets.controller")

const router = express.Router()

router.get("/", httpGetPlanets);

module.exports = router