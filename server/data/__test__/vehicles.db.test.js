import vehicles from "../../data/vehicles.db";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Vehicles DB", () => {
  test("Add and retrieve vehicles", () => {
    const vehicleOne = {
      vin: "1",
      make: "MAKE",
    };
    const vehicleTwo = {
      vin: "2",
      make: "MAKE2",
    };
    const vehicleThree = {
      vin: "3",
      make: "MAKE3",
    };
    // Overwrite vehicle one using the same VIN
    const vehicleFour = {
      vin: "1",
      make: "MAKE4",
    };

    vehicles.addVehicle(vehicleOne);
    vehicles.addVehicle(vehicleTwo);
    vehicles.addVehicle(vehicleThree);
    vehicles.addVehicle(vehicleFour);

    expect(vehicles.getVehicle("2")).toEqual(vehicleTwo);
    expect(vehicles.getVehicle("3")).toEqual(vehicleThree);
    expect(vehicles.getVehicle("1")).toEqual(vehicleFour);
  });
});
