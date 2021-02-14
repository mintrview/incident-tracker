// Read from environment variables into a config module in practice.
const BASE_URL = `https://vpic.nhtsa.dot.gov/api`;

module.exports = {
  /**
   * Decodes the VIN and returns a vehicle object.
   *
   * @param {string} vin The VIN to decode
   * @returns A decoded vehicle object.
   */
  async decodeVINValues(vin) {
    const tracker = await fetch(`${BASE_URL}/vehicles/decodevinvalues/${vin}?format=json`);
    const { Results } = await tracker.json();
    const errorCode = Results[0].ErrorCode;

    make = Results[0].Make;
    model = Results[0].Model;
    year = Results[0].ModelYear;

    return { vin, make, model, year, errorCode };
  },
};
