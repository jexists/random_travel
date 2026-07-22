# 어디로?

여행지는 가고 싶지만 어디로 갈지 정하기 어려울 때, 미니게임으로 국내 여행지와 자동차 여행 코스를 정해 주는 모바일 우선 웹 서비스입니다.

## 개발 원칙

- 기능은 테스트를 먼저 작성하는 Red → Green → Refactor 순서로 개발합니다.
- 기본 브랜치는 `main`, 기능 브랜치는 `feat/random-travel-mvp`를 사용합니다.
- 커밋은 `<type>(optional-scope): <English imperative summary>` 형식의 Conventional Commits를 따릅니다.
- 허용 타입은 `feat`, `fix`, `test`, `refactor`, `docs`, `style`, `chore`, `build`, `ci`입니다.
- API 비밀키와 `.env.local`은 커밋하지 않습니다.

## 문서

- [제품 요구사항](docs/PRD.md)
- [구현 계획](docs/IMPLEMENTATION_PLAN.md)

## 환경 변수

구현 완료 후 `.env.example`을 `.env.local`로 복사하고 다음 키를 설정합니다.

```text
TOUR_API_KEY=
KAKAO_REST_API_KEY=
```

API 키가 없는 개발·테스트 환경에서는 고정 fixture 데이터를 사용합니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. `TOUR_API_KEY`가 있으면 실제 관광지·음식점·숙소를, `KAKAO_REST_API_KEY`가 있으면 실제 카페 검색 결과를 사용합니다. 외부 API가 일시적으로 실패해도 로컬 fixture로 코스를 완성합니다.

## 검증

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run test:e2e
npm run build
```

## 새로운 게임 추가

새 게임은 `src/features/games/game-definitions.ts`의 레지스트리에 정의하고 공통 `GameStage` 계약을 따릅니다. 활성화된 게임은 홈과 `게임도 랜덤으로` 기능에 자동으로 포함됩니다.

## 지도 데이터

대한민국 행정경계는 `southkorea/southkorea-maps`의 KOSTAT 기반 2013 경량 GeoJSON 스냅샷을 사용합니다. 서비스 출시 전 최신 SGIS 행정경계로 교체할 수 있도록 지역 카탈로그와 렌더링을 분리했습니다.
