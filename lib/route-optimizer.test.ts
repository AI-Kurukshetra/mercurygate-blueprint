import { describe, expect, it } from "vitest";

import { getRouteSuggestion } from "./route-optimizer";

describe("getRouteSuggestion", () => {
  it("returns mapped mileage for a known lane pair", () => {
    const result = getRouteSuggestion({
      originCity: "Los Angeles",
      originState: "CA",
      destinationCity: "Dallas",
      destinationState: "TX"
    });

    expect(result.estimatedMiles).toBe(1500);
    expect(result.estimatedTransitDays).toBe(3);
  });

  it("falls back to the default mileage for unknown lanes", () => {
    const result = getRouteSuggestion({
      originCity: "Phoenix",
      originState: "AZ",
      destinationCity: "Boise",
      destinationState: "ID"
    });

    expect(result.estimatedMiles).toBe(650);
    expect(result.summary).toContain("Phoenix, AZ");
  });
});
