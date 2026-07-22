"use client";

import { Dices, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { KoreaMap } from "@/features/regions/korea-map";
import type { RegionCandidate } from "@/features/regions/regions";

import { chooseRandom } from "./random-engine";

interface GameStageProps {
  gameId: string;
  candidates: RegionCandidate[];
  level: "province" | "district";
  provinceCode?: string;
  title: string;
  onComplete: (candidate: RegionCandidate) => void;
}

export function GameStage({ gameId, candidates, level, provinceCode, title, onComplete }: GameStageProps) {
  const selected = useMemo(() => chooseRandom(candidates), [candidates]);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const unlock = window.setTimeout(() => setReady(true), 800);
    const ticker = window.setInterval(() => setIndex((current) => (current + 1) % candidates.length), 100);
    return () => { window.clearTimeout(unlock); window.clearInterval(ticker); };
  }, [candidates.length]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && ready && !stopped) {
        event.preventDefault();
        setStopped(true);
        window.setTimeout(() => onComplete(selected), 550);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onComplete, ready, selected, stopped]);

  const current = stopped ? selected : candidates[index % candidates.length];
  const stop = () => {
    if (!ready || stopped) return;
    setStopped(true);
    window.setTimeout(() => onComplete(selected), 550);
  };

  return (
    <section>
      <p className="eyebrow">{level === "province" ? "STEP 3 · 전국" : "STEP 4 · 지역 안에서"}</p>
      <h2>{title}</h2>
      <p className="lead">어디에 멈출지 아무도 몰라요. 마음이 움직이는 순간 눌러주세요.</p>

      {gameId === "dart" && (
        <div className="game-board">
          <KoreaMap level={level} provinceCode={provinceCode} activeCode={current?.code} selectedCode={stopped ? selected.code : undefined} />
          <MapPin className="dart-marker" size={48} strokeWidth={3} aria-hidden />
          <div className="current-label" aria-live="polite">{current?.name}</div>
        </div>
      )}

      {gameId === "slot" && (
        <div className="game-board slot-board">
          <div className="slot-window" aria-live="polite">
            <span className="slot-kicker">오늘의 여행지는</span>
            <span className="slot-name">{current?.name}</span>
          </div>
        </div>
      )}

      {gameId === "card" && (
        <div className="game-board card-board">
          <div className="card-stack" aria-label="섞이고 있는 행운의 카드">
            <div className="mystery-card">?</div><div className="mystery-card">?</div><div className="mystery-card">?</div>
          </div>
          <div className="current-label" aria-live="polite">{stopped ? selected.name : "카드가 여행지를 고르는 중"}</div>
        </div>
      )}

      <button className="primary-button" type="button" onClick={stop} disabled={!ready || stopped}>
        <Dices size={19} aria-hidden /> {stopped ? `${selected.name} 당첨!` : ready ? "여기에서 멈추기" : "게임 준비 중..."}
      </button>
      <p className="hint">화면 버튼 또는 키보드 Space·Enter로 멈출 수 있어요.</p>
    </section>
  );
}
