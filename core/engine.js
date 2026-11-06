// core/engine.js — 콘텐츠 인덱스(Content). v2.19.0 N13: 교과서만 남아서 채점(Grader)·따라하기 가이드·타자 연습·{{식}} 바꿔 끼우기는
//   archive/classic/core/engine.js 로 옮겼어요. 문제(PROBLEMS)는 이제 「만들어 보기」 가 pid 로 가져다 쓰는 재료예요(core/book-derive.js).
const Content = {
  lessonMap: {}, problemMap: {}, byLesson: {},
  init() {
    LESSONS.forEach(l => { this.lessonMap[l.id] = l; this.byLesson[l.id] = []; if (l.terms && typeof GLOSSARY !== 'undefined') for (const [k, v] of Object.entries(l.terms)) if (!(k in GLOSSARY)) GLOSSARY[k] = v; }); // 레슨이 정의한 용어는 공용 용어집에 합류(코스별 용어)
    PROBLEMS.forEach(p => { if (this.problemMap[p.id]) console.warn('[콘텐츠 검사] id 중복: ' + p.id); this.problemMap[p.id] = p; (this.byLesson[p.lesson] = this.byLesson[p.lesson] || []).push(p); });
  },
  lesson(id) { return this.lessonMap[id]; },
  problem(id) { return this.problemMap[id]; },
  problemsOf(lid) { return this.byLesson[lid] || []; },
};
