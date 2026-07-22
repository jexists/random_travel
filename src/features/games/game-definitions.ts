import { createGameRegistry } from "./game-registry";

export const gameRegistry = createGameRegistry([
  { id: "dart", name: "지도 다트", description: "움직이는 조준점을 멈춰 다트를 던져요", icon: "🎯", enabled: true, order: 1 },
  { id: "slot", name: "여행 슬롯", description: "빠르게 흐르는 지역명을 딱 멈춰요", icon: "🎰", enabled: true, order: 2 },
  { id: "card", name: "행운의 카드", description: "마음이 가는 카드 한 장을 골라요", icon: "🃏", enabled: true, order: 3 },
]);
