# 홀덤 기사 & 쇼츠 제목 생성기

홀덤 토너먼트 미디어팀을 위한 AI 기사 및 유튜브 쇼츠 제목 자동 생성 웹 애플리케이션입니다.

## ⚡ Windows에서 바로 실행 (가장 쉬운 방법)

> **GitHub 웹페이지는 앱이 아닙니다.** README 설명만 보이는 코드 저장소입니다.

1. PC의 프로젝트 폴더를 엽니다: `바탕 화면\article`
2. **`앱 실행.bat`** 파일을 **더블클릭**
3. 잠시 후 브라우저가 자동으로 열리며 앱이 실행됩니다 (`http://localhost:3000`)

종료할 때는 검은색 터미널 창을 닫거나 `Ctrl+C`를 누르세요.

## 기술 스택

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS**
- **Google Gemini API** (gemini-1.5-flash)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local` 파일을 만든 뒤, Google AI Studio에서 발급받은 API 키를 입력하세요.

```bash
cp .env.local.example .env.local
```

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

API 키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 기능

- **플레이(핸드) 탭 관리**: 여러 핸드를 탭으로 추가/삭제하며 각각의 입력값과 생성 결과를 독립적으로 보관
- **핸드 정보 입력 폼**: 대회명, 인원, 블라인드/엔티, Pre-flop, 홀카드, Flop/Turn/River 카드 및 액션
- **AI 기사 작성**: Gemini API로 e스포츠 스타일의 전문 기사 자동 생성
- **마크다운 렌더링**: 생성된 기사를 읽기 쉬운 형태로 표시
- **쇼츠 제목 추천**: 유튜브 쇼츠용 후킹 제목 5개 자동 생성
- **제목 새로고침**: 기사는 유지한 채 쇼츠 제목만 다시 생성
- **기사 복사**: 원클릭 클립보드 복사

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── generate/       # 기사 + 쇼츠 제목 생성 API
│   │   └── refresh-titles/ # 쇼츠 제목만 재생성 API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── InputForm.tsx
│   ├── OutputArea.tsx
│   └── PlayTabs.tsx
└── lib/
    ├── gemini.ts
    ├── prompts.ts
    └── types.ts
```
