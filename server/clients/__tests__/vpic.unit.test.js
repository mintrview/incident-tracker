import vpic from "../vpic";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => {
      return {
        Results: [
          {
            ErrorCode: "0",
            Model: "Model",
            Make: "Make",
            ModelYear: "1990",
          },
        ],
      };
    },
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe("VPIC client", () => {
  test("Decode VIN number", async () => {
    const response = await vpic.decodeVINValues("VIN_NUMBER");
    expect(response).toEqual({
      vin: "VIN_NUMBER",
      errorCode: "0",
      model: "Model",
      year: "1990",
      make: "Make",
    });
  });
});
