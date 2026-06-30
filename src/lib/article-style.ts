export interface ArticleStyleConfig {
  examples: string[];
  skeleton: string;
  rules: string;
  updatedAt?: string;
  userCustomized?: boolean;
}

export const STYLE_STORAGE_KEY = "article-style-config";

const EXAMPLE_1 = `METIS BIG BOUNTY in CHANGWON (2026.03.15),

2026년 3월 15일 열린 METIS BIG BOUNTY in CHANGWON.
남은 인원은 5명. UTG 오픈 이후 버튼과 스몰 블라인드가 엮인 대형 승부가 펼쳐졌다.

Pre-flop
○ UTG 김은진 플레이어 32K Open Raise
○ BTN 조규목 플레이어 90K 3-bet
○ SB 심은지 플레이어 481K All-in
○ UTG 김은진 플레이어 Fold
○ BTN 조규목 플레이어 Call
Showdown
○ 조규목: Ah, Ac
○ 심은지: Ad, Kd
보드
○ Flop: 2c, Qd, 2h
○ Turn: 5s
○ River: 6s

플랍에서 보드가 페어를 이루며 변수가 제한된 가운데,
조규목 플레이어의 포켓 에이스가 끝까지 우위를 지켰다.
심은지 플레이어는 역전 카드를 찾지 못하며 승부는 그대로 마무리됐다.

이 핸드로 심은지 플레이어는 탈락했고,
파이널 테이블은 4인 체제로 재편됐다.`;

const EXAMPLE_2 = `METIS BIG BOUNTY in CHANGWON (2026.03.15),

2026년 3월 15일 열린 METIS BIG BOUNTY in CHANGWON.
블라인드 10,000 / 20,000, 엔티 20,000 상황에서 남은 인원은 4명.
칩 리더 조규목 플레이어와 세컨 칩 리더 김은진 플레이어 간의 빅팟 승부가 펼쳐졌다.

Pre-flop
○ CO 조규목 플레이어 35K Open Raise (Chip Leader)
○ SB 김은진 플레이어 120K 3-bet (Second Chip Leader)
○ CO 조규목 플레이어 Call
Flop: Kd, Qh, 5d
○ SB 김은진 플레이어 90K Bet
○ CO 조규목 플레이어 Call
Turn: 2s
○ SB 김은진 플레이어 150K Bet
○ CO 조규목 플레이어 Call
River: Td
○ SB 김은진 플레이어 Check
○ CO 조규목 플레이어 655K All-in
○ SB 김은진 플레이어 Call
Showdown
○ 김은진: Ad, Qd
○ 조규목: As, Qs

리버에서 조규목 플레이어가 대형 올인을 시도하며 압박에 나섰지만,
김은진 플레이어가 침착하게 콜을 선택했다.
쇼다운 결과 같은 탑 페어 상황에서 키커 우위(A♦)를 앞세운 김은진 플레이어가 팟을 가져갔다.

이 승부로 김은진 플레이어는 칩 리더 자리에 올라섰고,
이후에도 조규목 플레이어와 치열한 칩 리드 싸움을 이어가며
대회의 긴장감을 끝까지 끌어올렸다.`;

const EXAMPLE_3 = `METIS BIG BOUNTY in CHANGWON (2026.03.15),

2026년 3월 15일 열린 METIS BIG BOUNTY in CHANGWON.
블라인드 10,000 / 20,000, 엔티 20,000 상황에서 남은 인원은 4명.
칩 리더 조규목 플레이어와 세컨 칩 리더 김은진 플레이어 간의 빅팟 승부가 펼쳐졌다.

Pre-flop
○ CO 조규목 플레이어 35K Open Raise (Chip Leader)
○ SB 김은진 플레이어 120K 3-bet (Second Chip Leader)
○ CO 조규목 플레이어 Call
Flop: Kd, Qh, 5d
○ SB 김은진 플레이어 90K Bet
○ CO 조규목 플레이어 Call
Turn: 2s
○ SB 김은진 플레이어 150K Bet
○ CO 조규목 플레이어 Call
River: Td
○ SB 김은진 플레이어 Check
○ CO 조규목 플레이어 655K All-in
○ SB 김은진 플레이어 Call
Showdown
○ 김은진: Ad, Qd
○ 조규목: As, Qs

리버에서 T♦가 떨어지며 김은진 플레이어는 A 하이 플러시를 완성했다.
조규목 플레이어의 대형 올인에도 불구하고 침착하게 콜을 선택했고,
결국 빅팟을 가져가며 승부를 뒤집었다.

이 승부로 김은진 플레이어는 칩 리더 자리에 올라섰고,
이후에도 조규목 플레이어와 치열한 선두 경쟁을 이어갔다.`;

const EXAMPLE_4 = `METIS BIG BOUNTY in CHANGWON (2026.03.15),

2026년 3월 15일 열린 METIS BIG BOUNTY in CHANGWON.
블라인드 10,000 / 20,000, 엔티 20,000 상황에서 남은 인원은 4명.
스몰 블라인드와 빅블라인드 간의 프리플랍 올인 승부가 펼쳐졌다.

Pre-flop
○ SB 조규목 플레이어 All-in (Cover Stack)
○ BB 정선화 플레이어 87K Call
Showdown
○ 조규목: 5c, 9s
○ 정선화: 7d, Jd
보드
○ Flop: Kh, 2s, 5h
○ Turn: 3c
○ River: 3h

플랍에서 5를 맞힌 조규목 플레이어가 원페어로 앞서 나갔고,
턴과 리버에서도 추가적인 역전 카드는 나오지 않았다.
조규목 플레이어가 해당 핸드를 가져가며 승리를 확정했다.

이 핸드로 정선화 플레이어는 탈락했고,
파이널 테이블은 3인 체제로 압축됐다.`;

const EXAMPLE_5 = `METIS CLOSER in DAEGU (2026.05.25),

2026년 5월 25일 열린 METIS CLOSER in DAEGU.
파이널 테이블은 8명으로 시작됐으며, 블라인드 50,000 / 100,000, 엔티 100,000 상황에서 프리플랍 올인 승부가 펼쳐졌다.

Pre-flop
○ UTG 조규목 플레이어 525K All-in
○ BTN 이기관 플레이어 1,300K All-in
Showdown
○ UTG 조규목: Jh, 8h
○ BTN 이기관: Ac, Kc
보드
○ Flop: 4s, Jd, Ad
○ Turn: Ks
○ River: Qd

플랍에서 조규목 플레이어가 J 원페어를 만들었지만,
이기관 플레이어 역시 A를 맞히며 탑 페어로 앞서 나갔다.
턴에서 K가 추가되며 이기관 플레이어는 A-K 투페어를 완성했고,
리버에서도 승부를 뒤집을 카드는 나오지 않았다.

이기관 플레이어가 해당 핸드를 가져가며 승리를 확정했고,
조규목 플레이어는 파이널 테이블 첫 탈락자로 마무리됐다.`;

export const DEFAULT_ARTICLE_STYLE: ArticleStyleConfig = {
  examples: [EXAMPLE_1, EXAMPLE_2, EXAMPLE_3, EXAMPLE_4, EXAMPLE_5],
  skeleton: `{대회명} ({YYYY.MM.DD}),


{년}년 {월}월 {일}일 열린 {대회명}.
{블라인드/엔티/남은 인원 등 상황을 1~2문장으로 설정}

Pre-flop
○ {포지션} {이름} 플레이어 {액션}
○ {포지션} {이름} 플레이어 {액션}

[멀티 스트리트 핸드인 경우 — 프리플랍 올인이 아닐 때]
Flop: {카드1}, {카드2}, {카드3}
○ {포지션} {이름} 플레이어 {액션}
Turn: {카드}
○ {포지션} {이름} 플레이어 {액션}
River: {카드}
○ {포지션} {이름} 플레이어 {액션}

Showdown
○ {이름}: {카드1}, {카드2}

[프리플랍 올인 등 보드를 나중에 정리할 때]
보드
○ Flop: {카드1}, {카드2}, {카드3}
○ Turn: {카드}
○ River: {카드}


{스트리트별 진행과 승부 결과를 1~2문단으로 해설}

{대회에 미친 영향 — 탈락, 칩 리더 변경, 파이널 테이블 인원 변화 등 1문단}`,
  rules: `- 입력된 핸드 데이터에 없는 정보는 추측하거나 지어내지 않는다.
- 마크다운(##, **, ---)을 사용하지 않고 예시와 같이 일반 텍스트로 작성한다.
- 첫 줄은 "{대회명} ({YYYY.MM.DD})," 형식으로 쓴다.
- 도입부는 "{년}년 {월}월 {일}일 열린 {대회명}."으로 시작하고, 이어서 블라인드·엔티·남은 인원·핸드 성격을 1~2문장으로 설명한다.
- 액션 목록은 반드시 "○" 기호로 시작하고, "○ {포지션} {이름} 플레이어 {액션}" 형식을 따른다.
- 칩 금액은 32K, 90K, 481K처럼 K 단위로 표기한다. (입력 데이터 그대로)
- 카드 표기는 Ah, Kd, 2c처럼 랭크+문자(suit) 형식을 사용한다. 본문에서 강조할 때는 A♦처럼 유니코드 심볼도 가능하다.
- 섹션 제목은 Pre-flop, Flop, Turn, River, Showdown, 보드 를 예시와 동일한 대소문자·표기로 쓴다.
- 멀티 스트리트 핸드: 각 스트리트 보드 카드를 "Flop: Kd, Qh, 5d" 형식으로 한 줄에 쓰고, 바로 아래에 해당 스트리트 액션을 ○ 목록으로 나열한다. Showdown은 모든 액션 이후에 배치한다.
- 프리플랍 올인 핸드: Pre-flop 액션 → Showdown → 보드(○ Flop/Turn/River) 순서로 작성한다.
- Chip Leader, Second Chip Leader, Cover Stack 등 입력에 있는 부가 정보는 괄호 안에 그대로 반영한다.
- 본문 해설은 차분하고 사실 중심의 e스포츠 중계 톤으로, 1~2문단으로 핸드 흐름과 승부 이유를 설명한다.
- 마지막 문단은 반드시 대회 전체 맥락(탈락, 칩 리더 교체, 파이널 테이블 인원 변화 등)으로 마무리한다.
- 플레이어 이름 뒤에는 항상 "플레이어"를 붙인다.`,
  updatedAt: undefined,
  userCustomized: false,
};

export function buildArticleSystemPrompt(style: ArticleStyleConfig): string {
  const exampleSection =
    style.examples.length > 0
      ? `## 참고 예시 (${style.examples.length}편)
아래 예시의 문체, 문장 밀도, 섹션 구성, 표현 방식을 최대한 따른다. 내용·인물·수치는 입력 데이터에 맞게 새로 작성한다.

${style.examples.map((ex, i) => `### 예시 ${i + 1}\n${ex.trim()}`).join("\n\n")}`
      : "";

  return `너는 프로 홀덤 토너먼트 e스포츠 전문 기자다. 제공된 핸드 데이터만을 근거로, 아래 출력 틀과 작성 규칙을 정확히 따라 기사를 작성한다.

## 작성 규칙
${style.rules}

## 출력 틀 (섹션 순서·구조를 반드시 유지)
${style.skeleton}
${exampleSection ? `\n${exampleSection}` : ""}

## 쇼츠 제목
기사 본문 작성이 끝난 뒤, 빈 줄을 두고 아래 형식으로 쇼츠 제목 5개를 추가한다.

## 쇼츠 제목 추천
1. {제목1}
2. {제목2}
3. {제목3}
4. {제목4}
5. {제목5}

쇼츠 제목은 15~25자, 어그로·후킹이 강하되 사실과 무관한 내용은 넣지 않는다.`;
}

export function loadStyleConfig(): ArticleStyleConfig {
  if (typeof window === "undefined") return DEFAULT_ARTICLE_STYLE;

  try {
    const raw = localStorage.getItem(STYLE_STORAGE_KEY);
    if (!raw) return DEFAULT_ARTICLE_STYLE;

    const parsed = JSON.parse(raw) as ArticleStyleConfig;

    if (!parsed.userCustomized) {
      return DEFAULT_ARTICLE_STYLE;
    }

    return {
      ...DEFAULT_ARTICLE_STYLE,
      ...parsed,
      examples: parsed.examples?.length
        ? parsed.examples
        : DEFAULT_ARTICLE_STYLE.examples,
    };
  } catch {
    return DEFAULT_ARTICLE_STYLE;
  }
}

export function saveStyleConfig(config: ArticleStyleConfig): void {
  localStorage.setItem(
    STYLE_STORAGE_KEY,
    JSON.stringify({ ...config, updatedAt: new Date().toISOString() })
  );
}

export function isCustomStyle(config: ArticleStyleConfig): boolean {
  if (config.userCustomized) return true;

  return (
    config.skeleton !== DEFAULT_ARTICLE_STYLE.skeleton ||
    config.rules !== DEFAULT_ARTICLE_STYLE.rules ||
    config.examples.length !== DEFAULT_ARTICLE_STYLE.examples.length
  );
}
