import municipalitiesData from "../../../public/data/municipalities.geo.json";
import provincesData from "../../../public/data/provinces.geo.json";

export interface RegionCandidate {
  code: string;
  name: string;
  nameEng?: string;
}

interface RegionFeature {
  properties: {
    code: string;
    name: string;
    name_eng?: string;
  };
}

function toCandidate(feature: RegionFeature): RegionCandidate {
  return {
    code: feature.properties.code,
    name: feature.properties.name,
    nameEng: feature.properties.name_eng,
  };
}

export const provinces = (provincesData.features as RegionFeature[])
  .map(toCandidate)
  .sort((a, b) => a.code.localeCompare(b.code));

export const municipalities = (municipalitiesData.features as RegionFeature[])
  .map(toCandidate)
  .sort((a, b) => a.code.localeCompare(b.code));

export function getDistricts(provinceCode: string): RegionCandidate[] {
  return municipalities.filter((district) => district.code.startsWith(provinceCode));
}
