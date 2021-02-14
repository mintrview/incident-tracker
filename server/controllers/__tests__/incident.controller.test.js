import incidentsController from "../incident.controller";
import incidents from "../../data/incidents.db";
import vehicles from "../../data/vehicles.db";
import moment from "moment";
import vpic from "../../clients/vpic";

jest.mock("../../clients/vpic");
jest.mock("../../data/incidents.db");
jest.mock("../../data/vehicles.db");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Incident controller", () => {
  let getIncident;
  let postIncident;

  const incident = {
    vin: "VIN_NUMBER",
    date: moment.now(),
    notes: "NOTES",
  };

  const vehicle = {
    make: "MAKE",
    model: "MODEL",
    year: "YEAR",
  };

  incidentsController({
    post: (_, fn) => {
      postIncident = fn;
    },
    get: (_, fn) => {
      getIncident = fn;
    },
  });

  test("Get incidents", (done) => {
    const incidentsList = [
      {
        ...incident,
        ...vehicle,
      },
    ];

    incidents.getIncidents.mockImplementationOnce(() => incidentsList);
    getIncident(
      {},
      {
        send: (obj) => {
          expect(obj).toEqual(incidentsList);
          done();
        },
      }
    );
  });

  test("Create incident", (done) => {
    incidents.addIncident.mockImplementationOnce(() => true);
    vehicles.getVehicle.mockImplementationOnce(() => vehicle);

    postIncident(
      { body: incident },
      {
        json: (response) => {
          expect(response).toEqual({ ...incident, ...vehicle });
          expect(vpic.decodeVINValues).toHaveBeenCalledTimes(0);
          expect(vehicles.getVehicle).toHaveBeenCalledTimes(1);
          done();
        },
      }
    );
  });

  test("Create incident with missing vehicle data", (done) => {
    incidents.addIncident.mockImplementationOnce(() => true);
    vehicles.getVehicle.mockImplementationOnce(() => null);
    vpic.decodeVINValues.mockImplementationOnce(() => ({ ...vehicle, errorCode: "0" }));

    const res = {
      status: (status) => {
        expect(status).toEqual(400);
        return res;
      },
      json: (response) => {
        expect(response).toEqual({ error: "Incident already exists" });
        done();
      },
    };

    postIncident(
      { body: incident },
      {
        json: (response) => {
          expect(response).toEqual({ ...incident, ...vehicle });
          expect(vpic.decodeVINValues).toHaveBeenCalledTimes(1);
          expect(vehicles.getVehicle).toHaveBeenCalledTimes(1);
          done();
        },
      }
    );
  });

  describe("Create incident validates parameters", () => {
    incidents.addIncident.mockImplementationOnce(() => true);
    vehicles.getVehicle.mockImplementationOnce(() => vehicle);

    const createRequest = (done) => {
      const res = {
        status: (status) => {
          expect(status).toEqual(400);
          return res;
        },
        json: (response) => {
          expect(response).toEqual({ error: "Invalid request" });
          done();
        },
      };
      return res;
    };

    [
      {
        body: {
          vin: null,
          notes: "notes",
          date: moment.now(),
        },
        testName: "Invalid VIN",
      },
      {
        body: {
          vin: "VIN_NUMBER",
          notes: null,
          date: moment.now(),
        },
        testName: "Invalid notes",
      },
      {
        body: {
          vin: "VIN_NUMBER",
          notes: "notes",
          date: moment().add(10, "days"),
        },
        testName: "Invalid date",
      },
    ].forEach(({ body, testName }) => {
      test(testName, (done) => {
        postIncident({ body }, createRequest(done));
      });
    });
  });

  test("Create incident fails if it already exists", (done) => {
    incidents.addIncident.mockImplementationOnce(() => false);
    vehicles.getVehicle.mockImplementationOnce(() => vehicle);

    const res = {
      status: (status) => {
        expect(status).toEqual(400);
        return res;
      },
      json: (response) => {
        expect(response).toEqual({ error: "Incident already exists" });
        done();
      },
    };

    postIncident({ body: incident }, res);
  });
});
