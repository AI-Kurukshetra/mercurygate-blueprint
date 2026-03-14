type RouteSuggestionInput = {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
};

type RouteSuggestion = {
  lane: string;
  estimatedMiles: number;
  estimatedTransitDays: number;
  summary: string;
};

const regionalPairs = new Map<string, number>([
  ["CA-TX", 1500],
  ["IL-GA", 720],
  ["NJ-FL", 1120],
  ["WA-CA", 980],
  ["OH-PA", 280]
]);

export function getRouteSuggestion(input: RouteSuggestionInput): RouteSuggestion {
  const key = `${input.originState}-${input.destinationState}`;
  const reverseKey = `${input.destinationState}-${input.originState}`;
  const estimatedMiles = regionalPairs.get(key) ?? regionalPairs.get(reverseKey) ?? 650;
  const estimatedTransitDays = Math.max(1, Math.ceil(estimatedMiles / 550));
  const lane = `${input.originCity}, ${input.originState} -> ${input.destinationCity}, ${input.destinationState}`;

  return {
    lane,
    estimatedMiles,
    estimatedTransitDays,
    summary: `${lane} | ${estimatedMiles} mi | ${estimatedTransitDays} days`
  };
}

