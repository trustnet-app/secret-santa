import { randomInt } from "node:crypto";

// Returns [[giverId, receiverId], ...] or null if the exclusions make it impossible.
// Members are arranged in one random ring, so nobody draws themselves and
// (with three or more people) no two people draw each other.
export function draw(memberIds, exclusions, tries = 500) {
  if (memberIds.length < 3) return null;
  const blocked = new Set();
  for (const [a, b] of exclusions) {
    blocked.add(`${a}:${b}`);
    blocked.add(`${b}:${a}`);
  }
  for (let t = 0; t < tries; t++) {
    const ring = [...memberIds];
    for (let i = ring.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [ring[i], ring[j]] = [ring[j], ring[i]];
    }
    const pairs = ring.map((g, i) => [g, ring[(i + 1) % ring.length]]);
    if (pairs.every(([g, r]) => !blocked.has(`${g}:${r}`))) return pairs;
  }
  return null;
}
