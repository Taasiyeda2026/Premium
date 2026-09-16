from pathlib import Path

p = Path('premium web/team-questionnaire/instructor.html')
s = p.read_text(encoding='utf-8')
old = """        return legacyNormalizeScores(source);
      }

      function scoreChips"""
new = """        const legacyAnswers = Array.isArray(student?.scoredAnswers) ? student.scoredAnswers : [];
        if (legacyAnswers.length && legacyAnswers.every(value => Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 3)) {
          const counts = { S:0, R:0, P:0, C:0 };
          const roleByOption = ['S','R','P','C'];
          legacyAnswers.forEach(value => { counts[roleByOption[Number(value)]] += 1; });
          const denominator = legacyAnswers.length + 4;
          return {
            S:Number((((counts.S+1)/denominator)*100).toFixed(1)),
            R:Number((((counts.R+1)/denominator)*100).toFixed(1)),
            P:Number((((counts.P+1)/denominator)*100).toFixed(1)),
            C:Number((((counts.C+1)/denominator)*100).toFixed(1))
          };
        }
        const legacy = legacyNormalizeScores(source);
        const total = Object.values(legacy).reduce((sum,value)=>sum+value,0);
        if (total > 0) Object.keys(legacy).forEach(role => { legacy[role] = Number((legacy[role]/total*100).toFixed(1)); });
        return legacy;
      }

      function scoreChips"""
assert old in s
p.write_text(s.replace(old, new, 1), encoding='utf-8')

sw = Path('service-worker.js')
t = sw.read_text(encoding='utf-8')
assert 'premium-static-v46' in t
sw.write_text(t.replace('premium-static-v46', 'premium-static-v47', 1), encoding='utf-8')
