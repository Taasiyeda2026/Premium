(() => {
  'use strict';

  const STORAGE_KEY = 'premiumTeamQuizDraftV3';
  const LEGACY_STORAGE_KEYS = ['premiumTeamQuizDraftV1', 'premiumTeamQuizDraftV2'];
  const RESULT_KEY = 'premiumTeamQuizResultV3';
  const QUESTIONNAIRE_VERSION = 3;
  const MIN_QUESTIONS = 12;
  const MAX_QUESTIONS = 14;
  const STOP_GAP = 0.10;
  const SUPABASE_URL = 'https://szinlhjuwyiyszdpsdop.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_k0IbDJlgPA9KTVuDWrCyFw_Zsa5kZIM';
  const roles = ['S', 'R', 'P', 'C'];

  const questions = {
    q1: {
      pair: ['S', 'R'],
      title: 'הזמנתם משהו באינטרנט. באפליקציה כתוב “נמסר”, אבל החבילה לא ליד הדלת. מה הדבר הראשון שאתם עושים?',
      options: [
        { text: 'בודקים איפה בדרך משהו השתבש ומה הצעד הכי הגיוני עכשיו.', role: 'S' },
        { text: 'פותחים מעקב, הזמנה והודעות ובודקים בדיוק מה כתוב שם.', role: 'R' },
        { text: 'חושבים איך היה אפשר לבנות את תהליך המשלוח כך שזה לא יקרה.', role: 'P' },
        { text: 'שולחים צילום מסך לחברים עם הודעה כמו “החבילה שלי התחילה חיים חדשים”.', role: 'C' }
      ]
    },
    q2: {
      pair: ['S', 'P'],
      title: 'חבר מראה לכם אפליקציה חדשה ואומר שזו המצאת השנה. מה הכי מסקרן אתכם?',
      options: [
        { text: 'איזו בעיה היא באמת פותרת ולמי?', role: 'S' },
        { text: 'כמה משתמשים יש לה ומה אנשים כותבים עליה?', role: 'R' },
        { text: 'תראה לי איך זה עובד בפועל.', role: 'P' },
        { text: 'אפשר להסביר אותה בסרטון של 15 שניות?', role: 'C' }
      ]
    },
    q3: {
      pair: ['R', 'P'],
      title: 'אתם רוצים לקנות אוזניות חדשות ויש עשרות אפשרויות. איך אתם מתחילים?',
      options: [
        { text: 'מחליטים קודם מה באמת חשוב: מחיר, סוללה, נוחות או משהו אחר.', role: 'S' },
        { text: 'פותחים השוואות, ביקורות ותגובות ומתחילים לבדוק.', role: 'R' },
        { text: 'בודקים מפרט, כפתורים, חיבורים ומה כל פונקציה עושה.', role: 'P' },
        { text: 'גם איך הן נראות ואיך מציגים אותן משפיע על הבחירה שלי.', role: 'C' }
      ]
    },
    q4: {
      anchor: true,
      title: 'פתחתם קבוצת WhatsApp ויש 73 הודעות. מה אתם מחפשים קודם?',
      options: [
        { text: 'מה החלטנו בסוף ומה צריך לקרות עכשיו?', role: 'S' },
        { text: 'מה העובדות שעליהן כולם מדברים ומה השתנה?', role: 'R' },
        { text: 'איזה פתרון אפשר להציע כדי לסגור את הדיון ולהתקדם?', role: 'P' },
        { text: 'איך לסכם לכולם במשפטים ברורים בלי שיצטרכו לקרוא הכול.', role: 'C' }
      ]
    },
    q5: {
      pair: ['R', 'C'],
      title: 'נפתחה גלידרייה חדשה ופתאום כולם מדברים עליה. מה אתם חושבים?',
      options: [
        { text: 'למה דווקא העסק הזה הצליח למשוך כל כך הרבה תשומת לב?', role: 'S' },
        { text: 'היא באמת טובה או שזה בעיקר הייפ? צריך לבדוק.', role: 'R' },
        { text: 'מה מיוחד במוצר עצמו לעומת גלידות אחרות?', role: 'P' },
        { text: 'איך הם גרמו לכל כך הרבה אנשים לדבר עליהם?', role: 'C' }
      ]
    },
    q6: {
      anchor: true,
      title: 'קיבלתם 1,000 ₪ כדי לשפר משהו בבית הספר. מה הדבר הראשון שאתם עושים?',
      options: [
        { text: 'בוחרים איזו בעיה הכי שווה לפתור עם הסכום הזה.', role: 'S' },
        { text: 'שואלים תלמידים מה באמת מפריע להם ביום-יום.', role: 'R' },
        { text: 'מתחילים לחשוב מה אפשר לבנות, לשנות או להוסיף.', role: 'P' },
        { text: 'חושבים איך לגרום לתלמידים להכיר את השינוי ולהשתמש בו.', role: 'C' }
      ]
    },
    q7: {
      pair: ['P', 'C'],
      title: 'העליתם Reel והוא קיבל הרבה יותר צפיות מהרגיל. מה הכי מתחשק לכם לעשות עכשיו?',
      options: [
        { text: 'להבין מה עשינו אחרת הפעם ולהחליט מה כדאי לנסות בסרטון הבא.', role: 'S' },
        { text: 'לפתוח את הנתונים ולבדוק מי צפה, מאיפה הגיעו הצפיות ומתי אנשים הפסיקו לצפות.', role: 'R' },
        { text: 'להכין גרסה נוספת עם שינוי אחד ולבדוק אם היא עובדת אפילו טוב יותר.', role: 'P' },
        { text: 'לחשוב איך לחדד את הפתיחה והמסר כדי שהסרטון הבא יתפוס מהר יותר.', role: 'C' }
      ]
    },
    q8: {
      anchor: true,
      title: 'יש מוצר שאתם משתמשים בו וכל פעם משהו בו מעצבן אתכם. מה עובר לכם בראש?',
      options: [
        { text: 'למה בכלל תכננו אותו בצורה הזאת?', role: 'S' },
        { text: 'מעניין אם גם אנשים אחרים מתלוננים על אותו דבר.', role: 'R' },
        { text: 'כבר יש לי רעיון איך הייתי משנה אותו.', role: 'P' },
        { text: 'אני יכול להסביר בדיוק מה לא ברור או לא נוח בו.', role: 'C' }
      ]
    },
    q9: {
      anchor: true,
      title: 'אתם מתכננים יום כיף עם חברים. מה התפקיד שאתם לוקחים באופן טבעי?',
      options: [
        { text: 'מסדרים את התמונה הגדולה: זמן, תקציב, מרחק ומה חשוב לכולם.', role: 'S' },
        { text: 'בודקים שעות, מחירים, ביקורות ומזג אוויר.', role: 'R' },
        { text: 'בונים מסלול שאפשר באמת לבצע בלי להיתקע.', role: 'P' },
        { text: 'מציגים לכולם שתי אפשרויות ברורות כדי שיחליטו.', role: 'C' }
      ]
    },
    q10: {
      pair: ['S', 'C'],
      title: 'אתם עובדים בצוות כבר רבע שעה, אבל מרגישים שלא באמת מתקדמים. מה אתם עושים?',
      options: [
        { text: 'עוצרים לרגע, מגדירים מה צריך להיות מוכן בסוף ומחליטים מה הצעד הבא.', role: 'S' },
        { text: 'בודקים מה בדיוק חסר לנו כדי לקבל החלטה טובה יותר.', role: 'R' },
        { text: 'מציעים לבנות או לנסות גרסה ראשונה, גם אם היא עדיין לא מושלמת.', role: 'P' },
        { text: 'מסכמים בקול מה כל אחד אמר כדי לוודא שכולם מבינים את אותו הדבר.', role: 'C' }
      ]
    },
    q11: {
      anchor: true,
      title: 'מישהו מניח על השולחן גאדג׳ט שאתם לא מכירים. מה קורה קודם?',
      options: [
        { text: 'אני רוצה להבין בשביל מה המציאו אותו בכלל.', role: 'S' },
        { text: 'אני בודק מי ייצר אותו ומה אומרים עליו.', role: 'R' },
        { text: 'אני לוחץ. אין סיכוי שאני לא לוחץ.', role: 'P' },
        { text: 'אני כבר חושב איך הייתי מציג אותו למישהו אחר.', role: 'C' }
      ]
    },
    q12: {
      pair: ['R', 'P'],
      title: 'חבר מציע רעיון חדש, אבל עדיין לא ברור אם הוא באמת יעבוד. מה אתם רוצים לעשות קודם?',
      options: [
        { text: 'להבין מה צריך לקרות כדי להפוך את הרעיון למשהו שאפשר להתקדם איתו.', role: 'S' },
        { text: 'לבדוק מה כבר יודעים על הנושא ומה אפשר ללמוד מאנשים או מפתרונות קיימים.', role: 'R' },
        { text: 'להכין משהו קטן שאפשר לנסות ולראות איך הרעיון עובד בפועל.', role: 'P' },
        { text: 'לנסות להסביר את הרעיון בצורה פשוטה ולראות אם אחרים מבינים ומתלהבים ממנו.', role: 'C' }
      ]
    },
    q13: {
      anchor: true,
      title: 'עברו חמש דקות מתחילת משימה קבוצתית והשולחן כבר מבולגן. מה אתם אומרים?',
      options: [
        { text: 'בואו נחליט מה חייב להיות מוכן עד סוף השיעור.', role: 'S' },
        { text: 'רגע, חסר לנו מידע לפני שממשיכים.', role: 'R' },
        { text: 'בואו ננסה משהו ונראה אם זה עובד.', role: 'P' },
        { text: 'אני עושה סדר במה שכבר יש כדי שכולם יבינו איפה אנחנו.', role: 'C' }
      ]
    },
    q14: {
      pair: ['S', 'P'],
      title: 'אתם כמעט מסיימים משימה קבוצתית, ופתאום מישהו מציע שינוי גדול. מה התגובה הטבעית שלכם?',
      options: [
        { text: 'בודקים מה השינוי ישפיע על התוצאה, הזמן ומה שכבר עשינו לפני שמחליטים.', role: 'S' },
        { text: 'רוצים להבין למה הוא מציע את השינוי ועל מה הוא מבסס אותו.', role: 'R' },
        { text: 'רוצים לנסות מהר את הגרסה החדשה ולראות אם היא באמת טובה יותר.', role: 'P' },
        { text: 'רוצים לוודא שכולם מבינים את ההצעה ושאפשר להגיע להחלטה משותפת.', role: 'C' }
      ]
    }
  };

  const anchorIds = ['q4', 'q6', 'q8', 'q9', 'q11', 'q13'];
  const dynamicIds = Object.keys(questions).filter(id => !questions[id].anchor);

  const els = {
    startScreen: document.getElementById('startScreen'),
    questionScreen: document.getElementById('questionScreen'),
    finishScreen: document.getElementById('finishScreen'),
    studentName: document.getElementById('studentName'),
    classCode: document.getElementById('classCode'),
    classCodeStatus: document.getElementById('classCodeStatus'),
    startBtn: document.getElementById('startBtn'),
    questionKicker: document.getElementById('questionKicker'),
    questionTitle: document.getElementById('questionTitle'),
    answers: document.getElementById('answers'),
    nextBtn: document.getElementById('nextBtn'),
    backBtn: document.getElementById('backBtn'),
    progressWrap: document.getElementById('progressWrap'),
    progressLabel: document.getElementById('progressLabel'),
    progressBar: document.getElementById('progressBar'),
    submitStatus: document.getElementById('submitStatus'),
    debugBox: document.getElementById('debugBox')
  };

  LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
  let state = createInitialState();
  let verifiedClassCode = null;
  let verifiedStudentKey = null;
  let codeCheckSequence = 0;
  let startCheckTimer = null;
  let submitting = false;

  function makeId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}-0000-4000-8000-000000000000`.slice(0, 36);
  }

  function hashString(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    let x = seed || 123456789;
    return () => {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return (x >>> 0) / 4294967296;
    };
  }

  function seededShuffle(values, seedText) {
    const arr = values.slice();
    const rng = makeRng(hashString(seedText));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createInitialState() {
    const submissionId = makeId();
    const anchorSequence = seededShuffle(anchorIds, `${submissionId}|anchors`);
    return {
      current: 0,
      name: '',
      classCode: '',
      submissionId,
      anchorSequence,
      sequence: anchorSequence.slice(),
      answers: {}
    };
  }

  function saveDraft() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function resetDraft() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function switchScreen(target) {
    [els.startScreen, els.questionScreen, els.finishScreen].forEach(el => el.classList.remove('active'));
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function normalizedStudentName() {
    return els.studentName.value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('he');
  }

  function currentStudentKey() {
    const code = els.classCode.value.trim();
    const name = normalizedStudentName();
    return /^\d{6}$/.test(code) && name.length >= 2 ? `${code}|${name}` : '';
  }

  function validateStart() {
    const code = els.classCode.value.trim();
    const key = currentStudentKey();
    els.startBtn.disabled = !(key && verifiedClassCode === code && verifiedStudentKey === key);
  }

  function apiHeaders() {
    return {
      'apikey': SUPABASE_PUBLISHABLE_KEY,
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  async function verifyClassCode(showError = true) {
    const code = els.classCode.value.trim();
    const studentName = els.studentName.value.trim().replace(/\s+/g, ' ');
    const key = currentStudentKey();
    const sequence = ++codeCheckSequence;
    verifiedClassCode = null;
    verifiedStudentKey = null;
    validateStart();

    if (!/^\d{6}$/.test(code)) {
      els.classCodeStatus.textContent = showError && code.length ? 'יש להזין קוד כיתה בן 6 ספרות.' : '';
      return false;
    }
    if (studentName.length < 2) {
      els.classCodeStatus.textContent = '';
      return false;
    }

    try {
      els.classCodeStatus.textContent = 'בודקים את הפרטים...';
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/premium_questionnaire_class_is_active`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ p_class_code: code })
      });
      if (!response.ok) throw new Error(`Class check failed: ${response.status}`);
      const isActive = await response.json();
      if (sequence !== codeCheckSequence || key !== currentStudentKey()) return false;
      if (isActive !== true) {
        els.classCodeStatus.textContent = 'קוד הכיתה לא פעיל. בדקו את הקוד שקיבלתם מהמדריך.';
        validateStart();
        return false;
      }

      const duplicateResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/premium_questionnaire_submission_exists`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ p_class_code: code, p_student_name: studentName })
      });
      if (!duplicateResponse.ok) throw new Error(`Duplicate check failed: ${duplicateResponse.status}`);
      const alreadySubmitted = await duplicateResponse.json();
      if (sequence !== codeCheckSequence || key !== currentStudentKey()) return false;
      if (alreadySubmitted === true) {
        els.classCodeStatus.textContent = 'כבר מילאתם את השאלון בכיתה הזו. אי אפשר למלא אותו פעם נוספת.';
        validateStart();
        return false;
      }

      verifiedClassCode = code;
      verifiedStudentKey = key;
      els.classCodeStatus.textContent = '';
      validateStart();
      return true;
    } catch (error) {
      console.error(error);
      if (sequence === codeCheckSequence) {
        els.classCodeStatus.textContent = 'לא ניתן לבדוק כרגע את הפרטים. נסו שוב.';
        validateStart();
      }
      return false;
    }
  }

  function scheduleStartCheck() {
    clearTimeout(startCheckTimer);
    verifiedClassCode = null;
    verifiedStudentKey = null;
    codeCheckSequence += 1;
    els.classCodeStatus.textContent = '';
    validateStart();
    if (/^\d{6}$/.test(els.classCode.value.trim()) && normalizedStudentName().length >= 2) {
      startCheckTimer = setTimeout(() => verifyClassCode(true), 280);
    }
  }

  function optionOrder(questionId) {
    return seededShuffle([0, 1, 2, 3], `${state.submissionId}|${questionId}|options`);
  }

  function evidenceCounts() {
    const counts = { S: 0, R: 0, P: 0, C: 0 };
    state.sequence.forEach(questionId => {
      const optionIndex = state.answers[questionId];
      if (!Number.isInteger(optionIndex)) return;
      const role = questions[questionId]?.options?.[optionIndex]?.role;
      if (roles.includes(role)) counts[role] += 1;
    });
    return counts;
  }

  function calculateProfile() {
    const counts = evidenceCounts();
    const answered = Object.values(counts).reduce((sum, value) => sum + value, 0);
    const denominator = answered + roles.length;
    const profile = {};
    roles.forEach(role => {
      profile[role] = (counts[role] + 1) / denominator;
    });
    return { counts, profile, answered };
  }

  function rankedRoles(profile) {
    return roles.slice().sort((a, b) => {
      const delta = profile[b] - profile[a];
      if (Math.abs(delta) > 1e-9) return delta;
      return (hashString(`${state.submissionId}|rank|${a}`) % 100000) - (hashString(`${state.submissionId}|rank|${b}`) % 100000);
    });
  }

  function pairKey(pair) {
    return pair.slice().sort().join('|');
  }

  function chooseNextDynamicQuestion() {
    const used = new Set(state.sequence);
    const available = dynamicIds.filter(id => !used.has(id));
    if (!available.length) return null;

    const { profile } = calculateProfile();
    const ranked = rankedRoles(profile);
    const top = ranked[0];
    const second = ranked[1];
    const topGap = profile[top] - profile[second];

    let targetPair;
    if (topGap < STOP_GAP) {
      targetPair = [top, second];
    } else {
      const secondary = ranked.slice(1);
      targetPair = [secondary[0], secondary[1]];
    }
    const targetKey = pairKey(targetPair);
    const exact = available.filter(id => pairKey(questions[id].pair || []) === targetKey);
    if (exact.length) {
      return seededShuffle(exact, `${state.submissionId}|${state.sequence.length}|${targetKey}`)[0];
    }

    const pairUse = {};
    state.sequence.forEach(id => {
      const pair = questions[id]?.pair;
      if (!pair) return;
      const key = pairKey(pair);
      pairUse[key] = (pairUse[key] || 0) + 1;
    });

    const scored = available.map(id => {
      const pair = questions[id].pair || [top, second];
      const a = pair[0], b = pair[1];
      const information = 2 * Math.min(profile[a] || 0, profile[b] || 0);
      const novelty = pairUse[pairKey(pair)] ? 0 : 0.02;
      const deterministic = (hashString(`${state.submissionId}|${id}|${state.sequence.length}`) % 1000) / 1000000;
      return { id, utility: information + novelty + deterministic };
    }).sort((a, b) => b.utility - a.utility);
    return scored[0].id;
  }

  function appendNextQuestion() {
    if (state.sequence.length < state.anchorSequence.length) {
      const id = state.anchorSequence[state.sequence.length];
      if (id) state.sequence.push(id);
      return Boolean(id);
    }
    const nextId = chooseNextDynamicQuestion();
    if (!nextId) return false;
    state.sequence.push(nextId);
    return true;
  }

  function shouldStop() {
    const { profile, answered } = calculateProfile();
    if (answered < MIN_QUESTIONS) return false;
    if (answered >= MAX_QUESTIONS) return true;
    const ranked = rankedRoles(profile);
    return (profile[ranked[0]] - profile[ranked[1]]) >= STOP_GAP;
  }

  function canFinishCurrent() {
    const questionId = state.sequence[state.current];
    if (!Number.isInteger(state.answers[questionId])) return false;
    if (state.current !== state.sequence.length - 1) return false;
    const { answered } = calculateProfile();
    return answered >= MIN_QUESTIONS && (shouldStop() || answered >= MAX_QUESTIONS || !dynamicIds.some(id => !state.sequence.includes(id)));
  }

  function renderQuestion() {
    const questionId = state.sequence[state.current];
    const q = questions[questionId];
    if (!q) return;
    const selected = state.answers[questionId];
    const order = optionOrder(questionId);
    const number = state.current + 1;

    els.questionKicker.textContent = `שאלה ${number}`;
    els.questionTitle.textContent = q.title;
    els.answers.replaceChildren();

    order.forEach(optionIndex => {
      const option = q.options[optionIndex];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-btn' + (selected === optionIndex ? ' selected' : '');
      btn.setAttribute('aria-pressed', selected === optionIndex ? 'true' : 'false');
      btn.innerHTML = `<span class="answer-dot">✓</span><span>${escapeHtml(option.text)}</span>`;
      btn.addEventListener('click', () => selectAnswer(questionId, optionIndex));
      els.answers.appendChild(btn);
    });

    els.nextBtn.disabled = !Number.isInteger(state.answers[questionId]) || submitting;
    els.nextBtn.textContent = canFinishCurrent() ? 'שליחה' : 'המשך';
    els.backBtn.style.visibility = state.current === 0 ? 'hidden' : 'visible';
    els.progressLabel.textContent = `שאלה ${number}`;
    els.progressBar.style.width = `${Math.min(100, (number / MAX_QUESTIONS) * 100)}%`;
    els.progressWrap.style.display = window.innerWidth >= 680 ? 'block' : 'none';
  }

  function selectAnswer(questionId, optionIndex) {
    const previous = state.answers[questionId];
    if (previous !== optionIndex && state.current < state.sequence.length - 1) {
      const removed = state.sequence.slice(state.current + 1);
      removed.forEach(id => { delete state.answers[id]; });
      state.sequence = state.sequence.slice(0, state.current + 1);
    }
    state.answers[questionId] = optionIndex;
    saveDraft();
    renderQuestion();
  }

  function structuredAnswers() {
    return state.sequence.map((questionId, orderIndex) => {
      const optionIndex = state.answers[questionId];
      const role = questions[questionId]?.options?.[optionIndex]?.role || null;
      return { questionId, order: orderIndex + 1, optionIndex, role };
    });
  }

  function profileForStorage() {
    const { profile } = calculateProfile();
    const result = {};
    roles.forEach(role => { result[role] = Number((profile[role] * 100).toFixed(1)); });
    const total = roles.reduce((sum, role) => sum + result[role], 0);
    if (Math.abs(total - 100) >= 0.1) {
      const ranked = rankedRoles(profile);
      result[ranked[0]] = Number((result[ranked[0]] + (100 - total)).toFixed(1));
    }
    return result;
  }

  async function submitQuiz() {
    if (submitting) return;
    const { answered } = calculateProfile();
    if (answered < MIN_QUESTIONS || !canFinishCurrent()) return;

    submitting = true;
    els.nextBtn.disabled = true;
    els.nextBtn.textContent = 'שולחים...';
    els.backBtn.disabled = true;
    els.submitStatus.textContent = '';

    const scores = profileForStorage();
    const scoredAnswers = structuredAnswers();
    const completedAt = new Date().toISOString();
    const result = {
      id: state.submissionId,
      name: state.name,
      classCode: state.classCode,
      scores,
      answers: scoredAnswers,
      completedAt,
      version: QUESTIONNAIRE_VERSION
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/premium_questionnaire_responses`, {
        method: 'POST',
        headers: { ...apiHeaders(), 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          submission_id: state.submissionId,
          student_name: state.name,
          class_code: state.classCode,
          scored_answers: scoredAnswers,
          scores,
          fun_answers: [],
          questionnaire_version: QUESTIONNAIRE_VERSION,
          completed_at: completedAt
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 409 && errorBody.includes('premium_questionnaire_responses_class_student_unique')) {
          els.submitStatus.textContent = 'כבר נשמרה תשובה עבור השם הזה בכיתה. אי אפשר לשלוח שאלון נוסף.';
          els.nextBtn.textContent = 'כבר נשלח';
          return;
        }
        throw new Error(`Save failed: ${response.status} ${errorBody}`);
      }

      localStorage.setItem(RESULT_KEY, JSON.stringify(result));
      resetDraft();
      switchScreen(els.finishScreen);

      const debug = new URLSearchParams(location.search).get('debug') === '1';
      if (debug) {
        els.debugBox.style.display = 'block';
        els.debugBox.textContent = JSON.stringify({ ...result, counts: evidenceCounts() }, null, 2);
      }
    } catch (error) {
      console.error(error);
      submitting = false;
      els.submitStatus.textContent = 'לא הצלחנו לשמור את התשובות. בדקו את החיבור ונסו שוב.';
      els.nextBtn.disabled = false;
      els.nextBtn.textContent = 'נסו שוב';
      els.backBtn.disabled = false;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  els.studentName.value = '';
  els.classCode.value = '';
  els.classCodeStatus.textContent = '';
  validateStart();

  els.studentName.addEventListener('input', scheduleStartCheck);
  els.classCode.addEventListener('input', () => {
    els.classCode.value = els.classCode.value.replace(/\D/g, '').slice(0, 6);
    scheduleStartCheck();
  });

  els.studentName.addEventListener('blur', () => {
    const key = currentStudentKey();
    if (key && verifiedStudentKey !== key) verifyClassCode(true);
  });

  els.classCode.addEventListener('blur', () => {
    const code = els.classCode.value.trim();
    const key = currentStudentKey();
    if (key && (verifiedClassCode !== code || verifiedStudentKey !== key)) verifyClassCode(true);
  });

  els.startBtn.addEventListener('click', async () => {
    const code = els.classCode.value.trim();
    const key = currentStudentKey();
    if (verifiedClassCode !== code || verifiedStudentKey !== key) {
      const ok = await verifyClassCode(true);
      if (!ok) return;
    }

    state = createInitialState();
    state.name = els.studentName.value.trim().replace(/\s+/g, ' ');
    state.classCode = code;
    saveDraft();
    switchScreen(els.questionScreen);
    renderQuestion();
  });

  els.nextBtn.addEventListener('click', () => {
    if (submitting) return;
    const questionId = state.sequence[state.current];
    if (!Number.isInteger(state.answers[questionId])) return;

    if (state.current < state.sequence.length - 1) {
      state.current += 1;
      saveDraft();
      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (canFinishCurrent()) {
      submitQuiz();
      return;
    }

    if (state.sequence.length < MAX_QUESTIONS && appendNextQuestion()) {
      state.current += 1;
      saveDraft();
      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    submitQuiz();
  });

  els.backBtn.addEventListener('click', () => {
    if (submitting || state.current <= 0) return;
    state.current -= 1;
    saveDraft();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('resize', () => {
    if (els.questionScreen.classList.contains('active')) renderQuestion();
  });
})();