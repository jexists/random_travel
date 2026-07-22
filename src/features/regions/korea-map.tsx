"use client";

import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useMemo } from "react";

import municipalitiesData from "../../../public/data/municipalities.geo.json";
import provincesData from "../../../public/data/provinces.geo.json";

import type { RegionCandidate } from "./regions";

interface Feature {
  type: "Feature";
  properties: { code: string; name: string };
  geometry: GeoPermissibleObjects;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

interface KoreaMapProps {
  level: "province" | "district";
  provinceCode?: string;
  activeCode?: string;
  selectedCode?: string;
  interactive?: boolean;
  onSelect?: (candidate: RegionCandidate) => void;
}

export function KoreaMap({ level, provinceCode, activeCode, selectedCode, interactive, onSelect }: KoreaMapProps) {
  const data = useMemo(() => {
    const source = (level === "province" ? provincesData : municipalitiesData) as FeatureCollection;
    if (level === "district" && provinceCode) {
      return { ...source, features: source.features.filter((feature) => feature.properties.code.startsWith(provinceCode)) };
    }
    return source;
  }, [level, provinceCode]);

  const paths = useMemo(() => {
    const projection = geoMercator().fitExtent([[14, 14], [306, 394]], data as never);
    const path = geoPath(projection);
    return data.features.map((feature) => ({ feature, d: path(feature as never) ?? "" }));
  }, [data]);

  return (
    <div className="map-wrap">
      <svg className="map-svg" viewBox="0 0 320 410" role="img" aria-label={level === "province" ? "대한민국 시·도 지도" : "시·군·구 지도"}>
        {paths.map(({ feature, d }) => {
          const code = feature.properties.code;
          const className = ["map-region", activeCode === code && "active", selectedCode === code && "selected"].filter(Boolean).join(" ");
          return (
            <path
              key={code}
              d={d}
              className={className}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : -1}
              aria-label={feature.properties.name}
              onClick={() => interactive && onSelect?.({ code, name: feature.properties.name })}
              onKeyDown={(event) => {
                if (interactive && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onSelect?.({ code, name: feature.properties.name });
                }
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
