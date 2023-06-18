const BASE_URL = "http://localhost:8000/v1";
// Load planets and return as JSON.
async function httpGetPlanets() {
  const res = await fetch(`${BASE_URL}/planets`);
  const planets = await res.json()
  return planets;
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const res = await fetch(`${BASE_URL}/launches`);
  const launches = await res.json();
  const sortedLaunches = launches.sort((a, b) => a.flightNumber - b.flightNumber)
  return sortedLaunches;
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
    const response = await fetch(`${BASE_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch)
    })
    return response;
  }catch(err){
    console.err(err)
    return {ok: false}
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    const response  = await fetch(`${BASE_URL}/launches/${id}`, {
      method: "DELETE",
    })

    return response;
  }catch(err){
    console.err(err);
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
