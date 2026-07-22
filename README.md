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

