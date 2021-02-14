const incidents = require("../data/incidents.db");
const vehicles = require("../data/vehicles.db");
const moment = require("moment");
const vpic = require("../clients/vpic");

/**
 * Creates a new incident and adds it to the internal data store.
 *
 * @param {express.request} req // The request object.
 * @param {express.response} res // The response object.
 */
async function createIncident(req, res) {
  // Basic schema validation that would be extended with
  // additional checks in practice.
  if (
    typeof req.body?.vin !== "string" ||
    typeof req.body?.notes !== "string" ||
    !moment(req.body?.date).isValid()
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const { vin, date, notes } = req.body;
  let make, model, year;

  try {
    let vehicle = vehicles.getVehicle(req.body.vin);
    if (!vehicle) {
      if (process.env.MOCKS === "1") {
        vehicle = { make: 'MAKE', model: 'MODEL', year: '1990' };
      } else {
        // Decode the VIN and add it to the in-memory data-store.
        vehicle = await vpic.decodeVINValues(vin);
        if (vehicle.errorCode !== "0") {
          return res.status(400).json({ error: "Invalid or incomplete VIN" });
        }
      }
      vehicles.addVehicle(vehicle);
    }
    ({ make, model, year } = vehicle);
  } catch (ex) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const incident = { vin, date, notes, make, model, year };
  if (!incidents.addIncident(incident)) {
    return res.status(400).json({ error: "Incident already exists" });
  } else {
    res.json(incident);
  }
}

/**
 * Returns all incidents in descending order by date.
 *
 * @param {*} _
 * @param {express.response} res // The response object.
 */
async function getIncidents(_, res) {
  res.send(incidents.getIncidents());
}

// Return the express registration function.
module.exports = (app) => {
  app.post("/incident", createIncident);
  app.get("/incident", getIncidents);
};
