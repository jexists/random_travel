# 어디로? 구현 계획

## 아키텍처

- Next.js App Router, React, TypeScript, Tailwind CSS
- `src/features/games`: 게임 레지스트리, 공통 추첨 엔진, 다트·슬롯·카드
- `src/features/regions`: 행정구역 데이터와 SVG 지도
- `src/features/journey`: 전체 단계 상태 머신과 세션 복원
- `src/features/course`: API 어댑터, 코스 생성과 결과 공유
- `src/shared`: 디자인 토큰, 공통 UI, 오류·분석 인터페이스

## TDD 규칙

모든 기능은 다음 순서를 따른다.

1. 실패하는 테스트를 먼저 작성한다.
2. 테스트가 의도한 이유로 실패하는지 확인한다.
3. 최소 구현으로 통과시킨다.
4. 중복과 책임 경계를 리팩터링한다.
5. 관련 테스트와 정적 검사를 다시 실행한다.
6. 통과한 상태만 커밋한다.

## 개발 단계

1. Next.js와 테스트 환경을 구성한다.
2. 디자인 토큰과 공통 UI를 테스트 우선으로 구현한다.
3. 게임 레지스트리와 균등 추첨 엔진을 구현한다.
4. 행정구역 타입·데이터·SVG 지도를 구현한다.
5. 사용자 진행 상태와 세션 복원을 구현한다.
6. 지도 다트 게임을 구현한다.
7. 여행 슬롯 게임을 구현한다.
8. 행운의 카드 게임을 구현한다.
9. TourAPI·카카오 어댑터와 코스 생성기를 구현한다.
10. 결과·카카오맵 연결·공유 URL을 구현한다.
11. 재추첨·분석 이벤트·접근성을 완성한다.
12. E2E와 모바일 시각 검수를 수행한다.

## 커밋 계획

```text
docs: add PRD and implementation plan
feat(ui): establish playful travel design system
feat(games): add extensible game registry and random engine
feat(regions): add interactive Korea maps
feat(journey): add travel decision state flow
feat(games): add map dart game
feat(games): add travel slot game
feat(games): add lucky card game
feat(course): generate randomized travel courses
feat(result): add course results and sharing
feat: add rerolls analytics and accessibility
test: cover random travel MVP end to end
```

## 완료 검증

```bash
npm run lint
npm run typecheck
npm run test -- --run
npm run test:e2e
npm run build
git status --short
```

