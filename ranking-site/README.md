# MiniLand Ranking Site

이 폴더는 메이플스토리 인게임 랭킹 창에서 바로 열리는 정적 웹사이트입니다.

## 포함된 기능

- `295x335` 창 크기 기준 UI
- `전체랭킹 / 직업랭킹` 전환
- `characterid` 기준 캐릭터 자동 선택
- `avatarUrl` PNG 주소 표시
- GitHub Pages 배포용 워크플로우 포함
- `data/latest.json` 자동 로드

## 인게임 연결

[MiniLandRanking.ini](C:/Users/user/Desktop/Penguins/1.2.95/MiniLand/MiniLandRanking.ini) 의 `2938`은 지금 아래 토큰을 사용합니다.

```ini
2938={ranking_entry_url}?worldid=%d&characterid=%d
```

동작 방식:

- `[GitHubPages]` 가 비어 있으면 로컬 `file:///.../ranking-site/index.html`
- `[GitHubPages]` 가 채워지면 GitHub Pages `https://<user>.github.io/<repo>/index.html`

## GitHub Pages 올리는 방법

1. 이 `ranking-site` 폴더 내용만 새 GitHub 저장소 루트에 올립니다.
2. 저장소 기본 브랜치를 `main` 으로 둡니다.
3. 저장소 Settings > Pages 에서 Source 를 `GitHub Actions` 로 바꿉니다.
4. 첫 push 뒤 `.github/workflows/deploy-pages.yml` 이 자동 배포합니다.

기본 URL 예시:

- 프로젝트 Pages: `https://your-github-id.github.io/miniland-ranking/`
- 유저 Pages 저장소: `https://your-github-id.github.io/`

## INI 자동 설정

GitHub 계정명과 저장소명이 정해졌다면 아래 스크립트로 `MiniLandRanking.ini` 와 `Release/MiniLandRanking.ini` 를 같이 바꿀 수 있습니다.

```powershell
.\setup-github-pages.ps1 -GitHubUser "your-github-id" -Repository "miniland-ranking"
```

또는 전체 URL 직접 지정:

```powershell
.\setup-github-pages.ps1 -Url "https://your-github-id.github.io/miniland-ranking"
```

## 데이터 소스

- GitHub Pages / 일반 웹호스트에서는 `./data/latest.json` 을 자동으로 읽습니다.
- `?api=https://your-api.example/ranking` 를 붙이면 외부 JSON API 를 읽습니다.
- 로컬 `file:///` 미리보기에서는 데모 데이터를 보여줍니다.

예시:

```text
https://your-github-id.github.io/miniland-ranking/?worldid=0&characterid=1001
https://your-github-id.github.io/miniland-ranking/?worldid=0&characterid=1001&api=https://your-api.example/ranking
```

## JSON 형식

예제 응답은 [api.example.json](C:/Users/user/Desktop/Penguins/1.2.95/MiniLand/ranking-site/api.example.json) 을 보면 됩니다.

중요 필드:

- `viewer.characterId`
- `viewer.avatarUrl`
- `rankings.overall`
- `rankings.byJob`

## 코디 이미지

"캐릭터가 입고 있는 옷 그대로" 를 제대로 보여주려면 `avatarUrl` 에 최종 렌더링된 PNG 주소를 넣는 방식이 가장 안정적입니다.

권장 흐름:

1. 서버가 캐릭터 장비 데이터를 읽음
2. 서버 또는 배치 스크립트가 아바타 PNG 생성
3. `data/latest.json` 또는 API 응답에 그 PNG 주소를 기록
