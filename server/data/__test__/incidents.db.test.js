import incidents from "../../data/incidents.db";
import moment from "moment";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Incident DB", () => {
  test("Add and retrieve incidents in descending order", () => {
    const incidentOne = {
      vin: "1",
      date: moment().subtract(3, "days"),
    };
    const incidentTwo = {
      vin: "2",
      date: moment().add(30, "days"),
    };
    const incidentThree = {
      vin: "3",
      date: moment().add(10, "days"),
    };
    const incidentFour = {
      vin: "4",
      date: moment().add(10, "days"),
    };
    const incidentFive = {
      vin: "5",
      date: moment().subtract(10, "days"),
    };

    incidents.addIncident(incidentOne);
    incidents.addIncident(incidentTwo);
    incidents.addIncident(incidentThree);
    incidents.addIncident(incidentFour);
    incidents.addIncident(incidentFive);

    expect(incidents.getIncidents()).toEqual([incidentTwo, incidentThree, incidentFour, incidentOne, incidentFive]);
  });

  test("Duplicate incidents are detected", () => {
    const now = moment();
    const incidentOne = {
      vin: "1",
      date: now,
      notes: "N/A",
    };
    const incidentTwo = {
      vin: "2",
      date: now,
      notes: "N/A",
    };
    // Duplicate of incident one
    const incidentThree = {
      vin: "1",
      date: now,
      notes: "N/A",
    };

    expect(incidents.addIncident(incidentOne)).toEqual(true);
    expect(incidents.addIncident(incidentTwo)).toEqual(true);
    expect(incidents.addIncident(incidentThree)).toEqual(false);
  });
});
