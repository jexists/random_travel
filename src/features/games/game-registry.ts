import { chooseRandom, type RandomSource } from "./random-engine";

export interface GameDefinition {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  description?: string;
  icon?: string;
}

export function createGameRegistry<T extends GameDefinition>(definitions: readonly T[]) {
  const enabled = definitions.filter((game) => game.enabled).sort((a, b) => a.order - b.order);

  return {
    list: () => [...enabled],
    get: (id: string) => enabled.find((game) => game.id === id),
    random: (random?: RandomSource) => chooseRandom(enabled, random),
  };
}
