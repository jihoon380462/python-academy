# vocab/sources — 단어 목록 원문

영어 단어장 「기초 일반 단어」 덱이 쓰는 공개 단어 목록이에요. 설명과 쓰는 법은 [`specs/vocab.md`](../../specs/vocab.md) 6절 W1 에 있어요.

## 출처와 라이선스

| 파일 | 무엇 | 받은 곳 |
|---|---|---|
| `NGSL_1.2_stats.csv` | New General Service List 1.2 — 단어와 순위 | https://www.newgeneralservicelist.com/new-general-service-list |
| `NGSL_1.2_lemmatized_for_teaching.csv` | NGSL 1.2 — 표제어와 다른 모양 | 〃 |
| `NGSL-Spoken_1.2_stats.csv` | New General Service List-Spoken 1.2 — 말에 자주 나오는 단어와 순위 | https://www.newgeneralservicelist.com/ngsl-spoken |
| `NGSL-Spoken_1.2_lemmatized_for_teaching.csv` | NGSL-Spoken 1.2 — 표제어와 다른 모양 | 〃 |

- 받은 날: 2026-11-12. 네 파일은 받은 그대로이고 고치지 않았어요.
- New General Service List by Browne, C., Culligan, B., and Phillips, J. is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
- New General Service List-Spoken by Browne, C. and Culligan, B., is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
- 라이선스 전문: https://creativecommons.org/licenses/by-sa/4.0/
- 위 두 문장은 받은 곳의 페이지에 적힌 표기 그대로예요.

## 이 폴더에서 만든 것

- `base-order.tsv`: 기초 덱의 배우는 차례표. 위 목록에서 `tools/vocab_base_order.mjs` 가 만들어요(손으로 고치지 않아요).
  - 차례: 말에 자주 나오는 단어(NGSL-Spoken)를 그 순위대로 먼저, 그다음 나머지 NGSL 을 순위대로
  - 원문의 `TRUE` · `FALSE`(표 계산 프로그램이 대문자로 바꾼 것)는 `true` · `false` 로 읽어요.
  - NGSL-Spoken 순위표에서 순위 칸이 `#N/A` 인 한 줄(`TRUE`)에는 빠진 번호를 채워요.
  - NGSL-Spoken 순위표 앞쪽의 다섯 낱말(pause · unclear · laugh · laughter · cough)은 말뭉치의 녹취 표시가 단어로 세어진 것으로 보고, 말 순위가 아니라 NGSL 순위 자리에 둬요. 차례표의 `spoken` 칸은 비워요.
  - 그래서 차례표의 앞 716개가 말 목록 순서이고, 모두 2,833개예요(NGSL 2,809개 + NGSL-Spoken 에만 있는 숫자 낱말 24개).
- 차례표와 이 목록을 바탕으로 만든 덱(`vocab/decks/base*.js`)도 같은 CC BY-SA 4.0 조건을 따라요. 뜻 · 예문 · 쓰임은 이 사이트가 직접 썼어요.
