export type RandomSource = () => number;

export function browserRandom(): number {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 2 ** 32;
}

export function chooseRandom<T>(candidates: readonly T[], random: RandomSource = browserRandom): T {
  if (candidates.length === 0) {
    throw new Error("후보가 없습니다");
  }

  const value = Math.min(Math.max(random(), 0), 1 - Number.EPSILON);
  return candidates[Math.floor(value * candidates.length)];
}
