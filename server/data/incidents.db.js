const moment = require("moment");

// Simulates a datastore for incidents with an in-memory object.
const incidentVinDateIndex = {};
const incidents = [];

module.exports = {
  // NOTE: For a real DB operation, these would be asynchronous
  // functions and the underlying datastore would be responsible
  // for ensuring mutual exclusion on reads and writes.
  addIncident(incident) {
    if (incidentVinDateIndex[incident.vin] && incidentVinDateIndex[incident.vin][incident.date]) {
      // There already exists an incident for this vehicle at the specified date.
      return false;
    }

    const parsedDate = moment(incident.date);

    // Sort order would presumably be controllable by the underlying DB.
    // For this simulation, only support inserting the date in descending order.
    incidents.push(incident);
    for (let i = incidents.length - 2; i >= 0; i--) {
      if (parsedDate.isSameOrBefore(incidents[i].date)) {
        break;
      }
      const temp = incidents[i];
      incidents[i] = incidents[i + 1];
      incidents[i + 1] = temp;
    }

    incidentVinDateIndex[incident.vin] = incidentVinDateIndex[incident.vin] || {};
    incidentVinDateIndex[incident.vin][incident.date] = incident;
    return true;
  },

  getIncidents() {
    return incidents;
  },
};
