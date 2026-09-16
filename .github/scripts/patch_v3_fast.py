from pathlib import Path
import re

p = Path('premium web/team-questionnaire/instructor.html')
s = p.read_text(encoding='utf-8')
optimizer = '''      function assignmentMetrics(members) {
        const regrets = members.map(item => item.regret);
        const fits = members.map(item => item.roleScore);
        return {
          maxRegret: Math.max(...regrets),
          totalRegret: regrets.reduce((sum, value) => sum + value, 0),
          minFit: Math.min(...fits),
          totalFit: fits.reduce((sum, value) => sum + value, 0),
          teamAverage: fits.reduce((sum, value) => sum + value, 0) / fits.length
        };
      }

      function compareNumber(a, b, direction = 'asc') {
        const delta = Number(a) - Number(b);
        if (Math.abs(delta) < 1e-9) return 0;
        return direction === 'asc' ? (delta < 0 ? -1 : 1) : (delta > 0 ? -1 : 1);
      }

      function compareMetrics(a, b) {
        return compareNumber(a.maxRegret, b.maxRegret, 'asc') ||
          compareNumber(a.totalRegret, b.totalRegret, 'asc') ||
          compareNumber(a.minFit, b.minFit, 'desc') ||
          compareNumber(a.teamSpread || 0, b.teamSpread || 0, 'asc') ||
          compareNumber(a.totalFit, b.totalFit, 'desc');
      }

      function bestAssignment(group) {
        const isFour = group.length === 4;
        const rolesForTeam = isFour
          ? [{ id:'S', value:s=>s.S }, { id:'R', value:s=>s.R }, { id:'P', value:s=>s.P }, { id:'C', value:s=>s.C }]
          : [{ id:'S', value:s=>s.S }, { id:'R', value:s=>s.R }, { id:'PC', value:s=>combinedPCScore(s) }];
        const perms = isFour ? perms4 : perms3;
        let best = null;
        perms.forEach(perm => {
          const members = rolesForTeam.map((role, roleIndex) => {
            const student = group[perm[roleIndex]];
            const assignedFit = role.value(student.scores);
            const bestAvailableFit = Math.max(...rolesForTeam.map(candidate => candidate.value(student.scores)));
            return { student, role:role.id, roleScore:assignedFit, regret:Math.max(0,bestAvailableFit-assignedFit) };
          });
          const metrics = assignmentMetrics(members);
          const candidate = { members, metrics };
          if (!best || compareMetrics(metrics,best.metrics)<0) best=candidate;
        });
        return best;
      }

      function partitionFromAssignments(assignments) {
        const members = assignments.flatMap(item => item.members);
        const averages = assignments.map(item => item.metrics.teamAverage);
        return {
          metrics: {
            maxRegret: Math.max(...members.map(item=>item.regret)),
            totalRegret: members.reduce((sum,item)=>sum+item.regret,0),
            minFit: Math.min(...members.map(item=>item.roleScore)),
            totalFit: members.reduce((sum,item)=>sum+item.roleScore,0),
            teamSpread: Math.max(...averages)-Math.min(...averages)
          },
          assignments
        };
      }

      function partitionQuality(groups) {
        return partitionFromAssignments(groups.map(bestAssignment));
      }

      function cloneGroups(groups) { return groups.map(group => group.slice()); }

      function localImprove(groups) {
        let current = partitionQuality(groups);
        let changed = true;
        let passes = 0;
        while (changed && passes < 14) {
          changed = false;
          passes += 1;
          let bestSwap = null;
          let bestCandidate = current;
          for (let a=0; a<groups.length; a++) {
            for (let b=a+1; b<groups.length; b++) {
              for (let ia=0; ia<groups[a].length; ia++) {
                for (let ib=0; ib<groups[b].length; ib++) {
                  [groups[a][ia],groups[b][ib]]=[groups[b][ib],groups[a][ia]];
                  const assignments = current.assignments.slice();
                  assignments[a] = bestAssignment(groups[a]);
                  assignments[b] = bestAssignment(groups[b]);
                  const candidate = partitionFromAssignments(assignments);
                  [groups[a][ia],groups[b][ib]]=[groups[b][ib],groups[a][ia]];
                  if (compareMetrics(candidate.metrics,bestCandidate.metrics)<0) {
                    bestCandidate = candidate;
                    bestSwap = {a,b,ia,ib};
                  }
                }
              }
            }
          }
          if (bestSwap) {
            const {a,b,ia,ib}=bestSwap;
            [groups[a][ia],groups[b][ib]]=[groups[b][ib],groups[a][ia]];
            current = bestCandidate;
            changed = true;
          }
        }
        return { groups:cloneGroups(groups), ...current };
      }

      function optimizeTeams(students, sizes, seedText) {
        const baseSeed = hashString(seedText);
        let globalBest = null;
        const restarts = Math.max(6, Math.min(10, Math.ceil(students.length / 3)));
        for (let restart=0; restart<restarts; restart++) {
          const rng = makeRng((baseSeed + Math.imul(restart+1,2654435761)) >>> 0);
          const order = shuffled(students,rng);
          const groups=[];
          let cursor=0;
          sizes.forEach(size=>{ groups.push(order.slice(cursor,cursor+size)); cursor+=size; });
          const improved = localImprove(groups);
          if (!globalBest || compareMetrics(improved.metrics,globalBest.metrics)<0) globalBest=improved;
        }
        return globalBest.assignments.map((assignment,index)=>({
          team:index+1,
          members:assignment.members.map(item=>({
            submissionId:item.student.submissionId,
            name:item.student.name,
            role:item.role,
            roleLabel:roleLabels[item.role],
            roleScore:Number(item.roleScore.toFixed(1))
          }))
        }));
      }
'''
s, n = re.subn(r'      function assignmentMetrics\(members\) \{.*?      async function buildTeams\(\) \{', optimizer + '\n      async function buildTeams() {', s, count=1, flags=re.S)
assert n == 1, f'expected optimizer replacement, got {n}'
assert 'partitionFromAssignments' in s
p.write_text(s, encoding='utf-8')

sw = Path('service-worker.js')
t = sw.read_text(encoding='utf-8')
assert "premium-static-v45" in t
needle = "  BASE + 'premium web/team-questionnaire/index.html',\n  BASE + 'premium web/team-questionnaire/instructor.html',"
replacement = "  BASE + 'premium web/team-questionnaire/index.html',\n  BASE + 'premium web/team-questionnaire/v3-engine.js',\n  BASE + 'premium web/team-questionnaire/instructor.html',"
assert needle in t
t = t.replace(needle, replacement, 1).replace('premium-static-v45','premium-static-v46',1)
sw.write_text(t,encoding='utf-8')
