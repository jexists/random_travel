"use client";

import { ArrowLeft, ArrowRight, Car, Compass, Dices, Map, MapPinned, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import type { TravelCourse } from "@/features/course/types";
import { encodeSharedTrip, type SharedTrip } from "@/features/course/share";
import { gameRegistry } from "@/features/games/game-definitions";
import { GameStage } from "@/features/games/game-stage";
import { KoreaMap } from "@/features/regions/korea-map";
import { getDistricts, provinces, type RegionCandidate } from "@/features/regions/regions";

import { initialJourneyState, journeyReducer } from "./journey-reducer";

const SESSION_KEY = "wheretogo:journey:v1";

function Header({ onBack, step = 1 }: { onBack?: () => void; step?: number }) {
  return (
    <>
      <div className="brand"><span className="brand-mark"><Compass size={20} /></span> 어디로?</div>
      {onBack && (
        <div className="stage-top">
          <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={17} /> 이전</button>
          <div className="progress" aria-label={`전체 6단계 중 ${step}단계`}>
            {[1, 2, 3, 4, 5, 6].map((value) => <span key={value} className={`progress-dot ${value <= step ? "active" : ""}`} />)}
          </div>
        </div>
      )}
    </>
  );
}

export function TravelApp({ initialTrip }: { initialTrip?: SharedTrip }) {
  const sharedState = initialTrip ? {
    stage: "result" as const,
    gameId: initialTrip.gameId,
    scope: "nationwide" as const,
    provinceCode: initialTrip.provinceCode,
    districtCode: initialTrip.districtCode,
    duration: initialTrip.duration,
  } : initialJourneyState;
  const [state, dispatch] = useReducer(journeyReducer, sharedState);
  const [course, setCourse] = useState<TravelCourse | undefined>(initialTrip?.course);
  const [courseError, setCourseError] = useState<string>();
  const [courseAttempt, setCourseAttempt] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as typeof state;
      if (parsed.stage !== "result" && parsed.stage !== "course") dispatch({ type: "hydrate", state: parsed });
    } catch { sessionStorage.removeItem(SESSION_KEY); }
  }, []);

  useEffect(() => { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); }, [state]);

  useEffect(() => {
    if (state.stage !== "result" || !course || !state.gameId || !state.provinceCode || !state.duration) return;
    const payload = encodeSharedTrip({
      version: 1,
      gameId: state.gameId,
      provinceCode: state.provinceCode,
      districtCode: state.districtCode,
      duration: state.duration,
      course,
    });
    window.history.replaceState(null, "", `?trip=${payload}`);
  }, [course, state]);

  const selectedGame = state.gameId ? gameRegistry.get(state.gameId) : undefined;
  const province = provinces.find((item) => item.code === state.provinceCode);
  const districts = useMemo(() => state.provinceCode ? getDistricts(state.provinceCode) : [], [state.provinceCode]);
  const district = districts.find((item) => item.code === state.districtCode);

  const restart = useCallback(() => {
    setCourse(undefined); setCourseError(undefined); dispatch({ type: "restartGame" });
  }, []);

  useEffect(() => {
    if (state.stage !== "course" || !state.provinceCode || !state.duration) return;
    let cancelled = false;
    fetch("/api/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provinceCode: state.provinceCode, districtCode: state.districtCode ?? state.provinceCode, districtName: district?.name, duration: state.duration }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).message ?? "코스를 만들지 못했어요");
        return response.json() as Promise<TravelCourse>;
      })
      .then((value) => { if (!cancelled) { setCourse(value); dispatch({ type: "showResult" }); } })
      .catch((error: Error) => { if (!cancelled) setCourseError(error.message); });
    return () => { cancelled = true; };
  }, [courseAttempt, district?.name, state.duration, state.provinceCode, state.districtCode, state.stage]);

  const selectProvince = (candidate: RegionCandidate) => {
    const nextDistricts = getDistricts(candidate.code);
    dispatch({ type: "selectProvince", provinceCode: candidate.code, skipDistrict: nextDistricts.length <= 1 });
  };

  return (
    <main className="app-shell">
      {state.stage === "game" && (
        <section>
          <Header />
          <div className="sticker-row"><span className="sticker"><MapPinned size={14} /> 국내 어디든</span><span className="sticker"><Car size={14} /> 자동차 여행</span></div>
          <p className="eyebrow">TRAVEL MINI GAME</p>
          <h1>여행,<br />어디로 갈까요?</h1>
          <p className="lead">결정은 게임에게 맡기고, 설레는 마음만 챙겨요. 오늘 끌리는 방법을 골라보세요.</p>
          <div className="card-grid">
            {gameRegistry.list().map((game) => (
              <button key={game.id} className="game-card" type="button" onClick={() => dispatch({ type: "selectGame", gameId: game.id })} aria-label={`${game.name}: ${game.description}`}>
                <span className="game-icon" aria-hidden>{game.icon}</span>
                <span><span className="game-title">{game.name}</span><span className="game-description">{game.description}</span></span>
                <ArrowRight className="arrow" size={20} />
              </button>
            ))}
          </div>
          <button className="random-button" type="button" onClick={() => dispatch({ type: "selectGame", gameId: gameRegistry.random().id })}><Sparkles size={17} /> 게임도 랜덤으로 골라줘</button>
        </section>
      )}

      {state.stage === "scope" && (
        <section>
          <Header onBack={restart} step={2} />
          <p className="eyebrow">{selectedGame?.name}</p>
          <h2>어디까지 맡겨볼까요?</h2>
          <p className="lead">전국을 통째로 맡기거나, 갈 수 있는 시·도만 먼저 정할 수 있어요.</p>
          <div className="choice-grid">
            <button className="choice-card" type="button" onClick={() => dispatch({ type: "selectScope", scope: "nationwide" })}><Dices size={28} /><strong>전국에서 랜덤</strong><span>시·도부터 시·군·구까지 모두 게임으로 정해요.</span></button>
            <button className="choice-card" type="button" onClick={() => dispatch({ type: "selectScope", scope: "selectedProvince" })}><Map size={28} /><strong>시·도 먼저 선택</strong><span>갈 수 있는 지역을 고르고 그 안에서 게임을 시작해요.</span></button>
          </div>
        </section>
      )}

      {state.stage === "provinceSelect" && (
        <section>
          <Header onBack={() => restart()} step={3} />
          <p className="eyebrow">시·도 먼저 선택</p><h2>어느 지역 안에서 놀까요?</h2><p className="lead">지도에서 원하는 시·도를 직접 눌러주세요.</p>
          <div className="game-board"><KoreaMap level="province" interactive onSelect={selectProvince} /></div>
        </section>
      )}

      {state.stage === "province" && state.gameId && (
        <><Header onBack={restart} step={3} /><GameStage gameId={state.gameId} candidates={provinces} level="province" title="시·도를 정해볼까요?" onComplete={selectProvince} /></>
      )}

      {state.stage === "district" && state.gameId && state.provinceCode && (
        <><Header onBack={() => dispatch({ type: "restartProvince" })} step={4} /><GameStage gameId={state.gameId} candidates={districts} level="district" provinceCode={state.provinceCode} title={`${province?.name} 어디로 갈까요?`} onComplete={(candidate) => dispatch({ type: "selectDistrict", districtCode: candidate.code })} /></>
      )}

      {state.stage === "duration" && (
        <section>
          <Header onBack={() => dispatch({ type: "restartDistrict" })} step={5} />
          <p className="eyebrow">{province?.name} {district?.name ?? ""}</p><h2>얼마나 떠나볼까요?</h2><p className="lead">지역은 정해졌어요. 이제 여행의 길이만 골라주세요.</p>
          <div className="duration-grid">
            <button className="duration-card" type="button" onClick={() => { setCourseError(undefined); dispatch({ type: "selectDuration", duration: "dayTrip" }); }}><span className="duration-emoji">☀️</span><strong>당일치기</strong><span>명소·식사·카페 4곳</span></button>
            <button className="duration-card" type="button" onClick={() => { setCourseError(undefined); dispatch({ type: "selectDuration", duration: "oneNightTwoDays" }); }}><span className="duration-emoji">🌙</span><strong>1박 2일</strong><span>숙소 포함 알찬 7곳</span></button>
          </div>
        </section>
      )}

      {state.stage === "course" && (
        <section><Header step={6} /><div className={courseError ? "error-card" : "loading-card"}>{courseError ? <><h2>코스를 만들지 못했어요</h2><p>{courseError}</p><button className="primary-button" onClick={() => { setCourseError(undefined); setCourseAttempt((value) => value + 1); }}>다시 시도하기</button></> : <><div className="spinner" /><h2>여행 코스를 짜는 중</h2><p className="lead">좋은 장소들을 동선에 맞게 연결하고 있어요.</p></>}</div></section>
      )}

      {state.stage === "result" && course && (
        <section>
          <Header onBack={restart} step={6} />
          <div className="result-hero"><span className="sticker">{selectedGame?.name}</span><p className="result-location">{province?.name}<br />{district?.name}</p><span>{state.duration === "dayTrip" ? "당일치기" : "1박 2일"} 랜덤 코스가 완성됐어요!</span></div>
          {course.days.map((day) => <div className="day-section" key={day.day}><div className="day-title"><h3>DAY {day.day}</h3><a className="route-link" href={day.kakaoRouteUrl} target="_blank" rel="noreferrer">카카오맵으로 열기 ↗</a></div><ol className="place-list">{day.places.map((place, index) => <li className="place-card" key={`${day.day}-${place.id}`}><span className="place-number">{index + 1}</span><span><strong>{place.name}</strong><br /><span className="place-category">{({ attraction: "관광·체험", food: "맛집", cafe: "카페", stay: "숙소" } as const)[place.category]}</span></span></li>)}</ol></div>)}
          <div className="result-actions"><button className="primary-button" type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>코스 링크 복사하기</button><button className="secondary-button" type="button" onClick={() => { setCourse(undefined); dispatch({ type: "restartDistrict" }); }}>이 지역에서 다시 뽑기</button><button className="secondary-button" type="button" onClick={restart}>다른 게임 해보기</button></div>
          <p className="notice">장소 영업시간과 휴무일은 방문 전에 꼭 확인해 주세요.</p>
        </section>
      )}
    </main>
  );
}
