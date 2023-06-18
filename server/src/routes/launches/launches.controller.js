const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchWithId,
} = require("../../models/launches.model");
const {
  getPagination
} = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  let {limit, skip} = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(limit, skip));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.target ||
    !launch.rocket ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate); 
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  try {
    await addNewLaunch(launch);
  } catch (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500);
  }

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const id = Number(req.params.id);

  try {
    const aborted = await abortLaunchWithId(id);
    res.status(200).json(aborted);
  } catch (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500);
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
