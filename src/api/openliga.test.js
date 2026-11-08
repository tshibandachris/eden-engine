import { normalizeMatch, leagues } from "./openliga";

describe("OpenLigaDB data normalization", () => {
  test("exposes the supported competition list", () => {
    expect(leagues.map((league) => league.code)).toEqual(["bl1", "bl2", "bl3", "dfb"]);
  });

  test("normalizes a match with a final score", () => {
    const match = normalizeMatch({
      MatchID: 42,
      MatchDateTime: "2026-11-08T17:30:00",
      Team1: { TeamName: "Team A" },
      Team2: { TeamName: "Team B" },
      MatchResults: [
        { ResultName: "Halbzeit", PointsTeam1: 1, PointsTeam2: 0 },
        { ResultName: "Endergebnis", PointsTeam1: 2, PointsTeam2: 1 },
      ],
    });

    expect(match).toEqual({
      id: "42",
      homeTeam: "Team A",
      awayTeam: "Team B",
      date: "2026-11-08T17:30:00",
      score: "2 – 1",
    });
  });

  test("keeps the score empty when no result exists", () => {
    const match = normalizeMatch({
      MatchID: 7,
      Team1: { TeamName: "Team A" },
      Team2: { TeamName: "Team B" },
      MatchResults: [],
    });
    expect(match.score).toBeNull();
  });

  test("ignores malformed entries", () => {
    expect(normalizeMatch({ MatchID: 1 })).toBeNull();
  });
});
