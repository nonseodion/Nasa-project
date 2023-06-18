const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_URL = "https://api.spacexdata.com/v5/launches/query";

async function populateLaunches() {
  console.log("Downloading Launch Data");
  const result = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
      ],
    },
  });

  const launches = result.data.docs;

  for (let i = 0; i < launches.length; i++) {
    const spaceXLaunch = launches[i];
    const launch = {
      mission: spaceXLaunch.name,
      flightNumber: spaceXLaunch.flight_number,
      success: spaceXLaunch.success,
      upcoming: spaceXLaunch.upcoming,
      rocket: spaceXLaunch.rocket?.name || "",
      launchDate: new Date(spaceXLaunch.date_local),
      customers: spaceXLaunch.payloads.flatMap((payload) => payload.customers),
    };

    await saveLaunch(launch);
  }

  console.log("Launch Data Downloaded Completely");
}

async function loadLaunches() {
  const presentLaunch = await findLaunch({
    rocket: "Falcon 1",
    mission: "FalconSat",
    flightNumber: 1,
  });

  if (presentLaunch) {
    console.log("Launch Data already loaded");
  }else {
      await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function launchExistsWithId(id) {
  return await findLaunch({
    flightNumber: id,
  });
}

async function getAllLaunches(limit, skip) {
  const result = await launches.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
  .skip(skip)
  .limit(limit);

  return result;
}

async function saveLaunch(launch) {
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("Planet not found");
  }

  const flightNumber = (await getLatestFlightNumber()) + 1;
  await launches.create({
    ...Object.assign(launch, {
      flightNumber: flightNumber,
      success: true,
      upcoming: true,
      customers: ["Nonse", "Vert"],
    }),
  });
}

async function getLatestFlightNumber() {
  const flight = await launches.findOne({}).sort("-flightNumber");
  if (!flight) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return flight.flightNumber;
}

async function abortLaunchWithId(id) {
  const updated = await launches.findOneAndUpdate(
    { flightNumber: id },
    { success: false, upcoming: false },
    { projection: "-_id -__v" }
  );

  if (!updated) {
    throw new Error("No Launch Found");
  }

  return updated;
}

module.exports = {
  launches,
  loadLaunches,
  getAllLaunches,
  addNewLaunch,
  launchExistsWithId,
  abortLaunchWithId,
};
