export type SelectionScope = "nationwide" | "selectedProvince";
export type TravelDuration = "dayTrip" | "oneNightTwoDays";
export type JourneyStage =
  | "game"
  | "scope"
  | "province"
  | "provinceSelect"
  | "district"
  | "duration"
  | "course"
  | "result";

export interface JourneyState {
  stage: JourneyStage;
  gameId?: string;
  scope?: SelectionScope;
  provinceCode?: string;
  districtCode?: string;
  duration?: TravelDuration;
}

export const initialJourneyState: JourneyState = { stage: "game" };

export type JourneyAction =
  | { type: "hydrate"; state: JourneyState }
  | { type: "selectGame"; gameId: string }
  | { type: "selectScope"; scope: SelectionScope }
  | { type: "selectProvince"; provinceCode: string; skipDistrict?: boolean }
  | { type: "selectDistrict"; districtCode: string }
  | { type: "selectDuration"; duration: TravelDuration }
  | { type: "showResult" }
  | { type: "restartProvince" }
  | { type: "restartDistrict" }
  | { type: "restartGame" };

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "selectGame":
      return { stage: "scope", gameId: action.gameId };
    case "selectScope":
      return {
        ...state,
        scope: action.scope,
        stage: action.scope === "nationwide" ? "province" : "provinceSelect",
      };
    case "selectProvince":
      return {
        ...state,
        provinceCode: action.provinceCode,
        districtCode: undefined,
        duration: undefined,
        stage: action.skipDistrict ? "duration" : "district",
      };
    case "selectDistrict":
      return { ...state, districtCode: action.districtCode, duration: undefined, stage: "duration" };
    case "selectDuration":
      return { ...state, duration: action.duration, stage: "course" };
    case "showResult":
      return { ...state, stage: "result" };
    case "restartProvince":
      return {
        gameId: state.gameId,
        scope: state.scope,
        provinceCode: undefined,
        districtCode: undefined,
        duration: undefined,
        stage: state.scope === "selectedProvince" ? "provinceSelect" : "province",
      };
    case "restartDistrict":
      return { ...state, districtCode: undefined, duration: undefined, stage: "district" };
    case "restartGame":
      return initialJourneyState;
  }
}
