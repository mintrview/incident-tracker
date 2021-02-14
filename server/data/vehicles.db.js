// Simulates a datastore for vehicles with an in-memory object.
const vehicles = {};

module.exports = {
  // NOTE: For a real DB operation, these would be asynchronous
  // functions and the underlying datastore would be responsible
  // for ensuring mutual exclusion on reads and writes.
  addVehicle(vehicle) {
    vehicles[vehicle.vin] = vehicle;
  },
  getVehicle(vin) {
    return vehicles[vin];
  },
};
