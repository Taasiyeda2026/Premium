from pathlib import Path

path = Path('premium web/team-questionnaire/index.html')
text = path.read_text(encoding='utf-8')

old = """      let verifiedClassCode = null;
      let codeCheckSequence = 0;"""
new = """      let verifiedClassCode = null;
      let verifiedStudentKey = null;
      let codeCheckSequence = 0;
      let startCheckTimer = null;"""
if old not in text:
    raise SystemExit('Questionnaire state block not found')
text = text.replace(old, new, 1)

start = text.index('      function validateStart() {')
end = text.index('      function renderQuestion() {', start)
validation = r'''      function normalizedStudentName() {
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

      async function verifyClassCode(showError = true) {
        const code = els.classCode.value.trim();
        const studentName = els.studentName.value.trim().replace(/\s+/g, ' ');
        const key = currentStudentKey();
        const sequence = ++codeCheckSequence;
        verifiedClassCode = null;
        verifiedStudentKey = null;
        validateStart();

        if (!/^\d{6}$/.test(code)) {
          if (showError && code.length) els.classCodeStatus.textContent = 'יש להזין קוד כיתה בן 6 ספרות.';
          else els.classCodeStatus.textContent = '';
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
            headers: {
              'apikey': SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
              'Content-Type': 'application/json'
            },
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
            headers: {
              'apikey': SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
              'Content-Type': 'application/json'
            },
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

'''
text = text[:start] + validation + text[end:]

old = "          if (!response.ok && response.status !== 409) throw new Error(`Save failed: ${response.status}`);"
new = """          if (!response.ok) {
            const errorBody = await response.text();
            if (response.status === 409 && errorBody.includes('premium_questionnaire_responses_class_student_unique')) {
              els.submitStatus.textContent = 'כבר נשמרה תשובה עבור השם הזה בכיתה. אי אפשר לשלוח שאלון נוסף.';
              els.submitBtn.disabled = true;
              els.submitBtn.textContent = 'כבר נשלח';
              els.funBackBtn.disabled = false;
              return;
            }
            if (response.status !== 409) throw new Error(`Save failed: ${response.status}`);
          }"""
if old not in text:
    raise SystemExit('Submit response guard not found')
text = text.replace(old, new, 1)

old = """      els.studentName.addEventListener('input', validateStart);

      els.classCode.addEventListener('input', () => {
        els.classCode.value = els.classCode.value.replace(/\D/g, '').slice(0, 6);
        verifiedClassCode = null;
        codeCheckSequence += 1;
        els.classCodeStatus.textContent = '';
        validateStart();
        if (els.classCode.value.length === 6) verifyClassCode(true);
      });

      els.classCode.addEventListener('blur', () => {
        if (els.classCode.value.length) verifyClassCode(true);
      });"""
new = """      els.studentName.addEventListener('input', scheduleStartCheck);

      els.classCode.addEventListener('input', () => {
        els.classCode.value = els.classCode.value.replace(/\D/g, '').slice(0, 6);
        scheduleStartCheck();
      });

      els.studentName.addEventListener('blur', () => {
        if (els.classCode.value.length === 6 && normalizedStudentName().length >= 2) verifyClassCode(true);
      });

      els.classCode.addEventListener('blur', () => {
        if (els.classCode.value.length && normalizedStudentName().length >= 2) verifyClassCode(true);
      });"""
if old not in text:
    raise SystemExit('Input validation handlers not found')
text = text.replace(old, new, 1)

old = """        const code = els.classCode.value.trim();
        if (verifiedClassCode !== code) {
          const ok = await verifyClassCode(true);"""
new = """        const code = els.classCode.value.trim();
        const key = currentStudentKey();
        if (verifiedClassCode !== code || verifiedStudentKey !== key) {
          const ok = await verifyClassCode(true);"""
if old not in text:
    raise SystemExit('Start click guard not found')
text = text.replace(old, new, 1)

path.write_text(text, encoding='utf-8')

sw = Path('service-worker.js')
sw_text = sw.read_text(encoding='utf-8')
if 'premium-static-v35' not in sw_text:
    raise SystemExit('Expected cache v35 not found')
sw.write_text(sw_text.replace('premium-static-v35', 'premium-static-v36', 1), encoding='utf-8')
