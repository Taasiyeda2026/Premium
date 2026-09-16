from pathlib import Path
import re

POSTER = Path('premium web/posterpremium.html')
SW = Path('service-worker.js')

s = POSTER.read_text(encoding='utf-8')


def replace_once(old, new, label):
    global s
    if old not in s:
        raise SystemExit(f'Missing patch target: {label}')
    s = s.replace(old, new, 1)

# 1) Simpler toolbar: no hidden limits action, PDF is the final export.
replace_once(
    "    <button class=\"tbb\" onclick=\"openTab('limits')\">מגבלות</button>\n    <button class=\"tbb sec\" onclick=\"window.print()\">🖨 PDF</button>",
    "    <button class=\"tbb sec\" onclick=\"producePdf()\">📄 הפקת PDF</button>",
    'toolbar limits/pdf buttons'
)

# 2) Three visible edit tabs only.
replace_once('grid-template-columns:repeat(4,1fr)', 'grid-template-columns:repeat(3,1fr)', 'sidebar tab columns')

# 3) Remove HTML download from the UI and explain autosave/PDF instead.
replace_once(
    '<div class="br2" style="margin-top:10px"><button class="pb warn" onclick="clearPoster()">נקה תוכן</button><button class="pb ok" onclick="downloadHtml()">שמור HTML</button></div>',
    '<div style="margin-top:10px"><button class="pb warn" style="width:100%" onclick="clearPoster()">נקה תוכן</button></div>',
    'save html controls'
)
replace_once(
    '<p class="pn">הפוסטר נשמר כעמוד HTML עצמאי. להדפסה או PDF יש ללחוץ על כפתור PDF בסרגל העליון.</p>',
    '<p class="pn">השינויים נשמרים אוטומטית בדפדפן. להפקת הקובץ הסופי לחצו על „הפקת PDF” בסרגל העליון.</p>',
    'save html help text'
)
replace_once(
    '<p class="pn">כל שינוי כאן מתעדכן מיד בפוסטר. אפשר להמשיך לערוך גם ישירות על הפוסטר עצמו.</p>',
    '<p class="pn">כל שינוי כאן מתעדכן מיד בפוסטר.</p>',
    'content panel help text'
)

# Remove the inaccessible limits panel itself.
s, count = re.subn(r'\n    <section id="tab-limits" class="tp" style="display:none!important">.*?</section>', '', s, count=1, flags=re.S)
if count != 1:
    raise SystemExit('Missing patch target: hidden limits section')

# 4) Clear visual flow from research/requirements to solution.
marker = '\n\n    <!-- צד שמאל -->'
if marker not in s:
    raise SystemExit('Missing patch target: left-column marker')
s = s.replace(
    marker,
    '\n\n    <div id="flow-to-solution" class="flow-to-solution" aria-hidden="true"><span class="flow-next-arrow">←</span><span dir="rtl">ממשיכים לפתרון</span></div>' + marker,
    1
)

# 5) Better image guidance in the initial physical view.
replace_once(
    '<span id="img-main-label">תמונה ראשית</span><small id="img-main-note">יחס 1:1 בפיזי / מסך טלפון בדיגיטלי</small>',
    '<span id="img-main-label">תמונה ראשית</span><small id="img-main-note">המוצר / הדגם</small>',
    'main image placeholder'
)
replace_once('<span id="img-1-label">תמונה 2</span>', '<span id="img-1-label">תהליך / אב־טיפוס</span>', 'image 2 placeholder')
replace_once('<span id="img-2-label">תמונה 3</span>', '<span id="img-2-label">שימוש / בדיקה</span>', 'image 3 placeholder')

# 6) Digital usage steps should read 1 -> 2 -> 3 from right to left in RTL.
replace_once('body.digital-mode #c-use .numbered-answer{\n  display:flex;\n  flex-direction:row-reverse;', 'body.digital-mode #c-use .numbered-answer{\n  display:flex;\n  flex-direction:row;', 'digital use order')

# 7) Flow cue styling, responsive preview helpers, and hardened A4 print layout.
css_anchor = '/* PRINT */\n@media print{'
if css_anchor not in s:
    raise SystemExit('Missing patch target: print css anchor')
extra_css = r'''.flow-to-solution{
  position:absolute;
  left:407px;
  top:1017px;
  width:357px;
  height:22px;
  z-index:3;
  display:flex;
  align-items:center;
  justify-content:flex-start;
  gap:6px;
  direction:ltr;
  color:var(--accent);
  font-size:10.5px;
  font-weight:900;
  pointer-events:none;
}
.flow-next-arrow{font-size:18px;line-height:1}
body.digital-mode .flow-to-solution{top:1037px;height:18px;font-size:9.5px}
body.digital-mode .flow-next-arrow{font-size:15px}

@media (max-width:720px){
  #sp{width:92vw}
  body.panel-open #wrap{padding-right:0}
  #wrap{padding:12px}
}
@media (max-width:620px){
  .tb-brand{display:none}
  #toolbar{justify-content:center;padding-left:7px;padding-right:7px;gap:5px}
  .mode-btn{padding:6px 9px}
  .tbb{padding:6px 8px;font-size:10px}
}

/* PRINT */
@media print{'''
s = s.replace(css_anchor, extra_css, 1)
replace_once(
    "  body{background:none!important;min-height:0!important;height:auto!important}\n  #toolbar,#sp,.counter,.ichg,.logo-box:after{display:none!important}\n  #wrap{margin:0!important;padding:0!important;background:none!important;min-height:0!important;height:auto!important}\n  #poster{box-shadow:none!important;outline:none!important;page-break-inside:avoid;break-inside:avoid;overflow:hidden!important;max-height:297mm}",
    "  html,body{width:210mm!important;height:297mm!important;overflow:hidden!important}\n  body{background:none!important;min-height:0!important;height:297mm!important}\n  #toolbar,#sp,.counter,.ichg,.logo-box:after{display:none!important}\n  #wrap{margin:0!important;padding:0!important;background:none!important;min-height:0!important;height:297mm!important;width:210mm!important}\n  #poster{width:210mm!important;height:297mm!important;zoom:1!important;transform:none!important;box-shadow:none!important;outline:none!important;page-break-inside:avoid;break-inside:avoid;overflow:hidden!important;max-height:297mm}",
    'print A4 rules'
)

# 8) Autosave engine (IndexedDB so uploaded images can be restored too) + preview scaling.
js_anchor = "const SZ={h:36,q:13.5,t:12};\n"
if js_anchor not in s:
    raise SystemExit('Missing patch target: JS constants anchor')
autosave_js = r'''const SZ={h:36,q:13.5,t:12};

const AUTOSAVE_DB='premium-poster-drafts';
const AUTOSAVE_STORE='drafts';
const AUTOSAVE_KEY='posterpremium-v1';
const AUTOSAVE_MAX_AGE=30*24*60*60*1000;
let autosaveTimer=null;
let restoringDraft=false;
let printTitleBackup='';

function openAutosaveDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){resolve(null);return}
    const req=indexedDB.open(AUTOSAVE_DB,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(AUTOSAVE_STORE))db.createObjectStore(AUTOSAVE_STORE);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function writeAutosave(data){
  const db=await openAutosaveDb(); if(!db)return;
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(AUTOSAVE_STORE,'readwrite');
    tx.objectStore(AUTOSAVE_STORE).put(data,AUTOSAVE_KEY);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error);
  });
  db.close();
}
async function readAutosave(){
  const db=await openAutosaveDb(); if(!db)return null;
  const value=await new Promise((resolve,reject)=>{
    const tx=db.transaction(AUTOSAVE_STORE,'readonly');
    const req=tx.objectStore(AUTOSAVE_STORE).get(AUTOSAVE_KEY);
    req.onsuccess=()=>resolve(req.result||null);
    req.onerror=()=>reject(req.error);
  });
  db.close();
  return value;
}
async function clearAutosave(){
  clearTimeout(autosaveTimer);
  const db=await openAutosaveDb(); if(!db)return;
  await new Promise((resolve,reject)=>{
    const tx=db.transaction(AUTOSAVE_STORE,'readwrite');
    tx.objectStore(AUTOSAVE_STORE).delete(AUTOSAVE_KEY);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error);
  });
  db.close();
}
function collectDraft(){
  const values={};
  if(typeof FILL_FIELDS!=='undefined')FILL_FIELDS.forEach(f=>{const el=G(f.id);if(el)values[f.id]=el.value||''});
  if(G('poster-students'))values['poster-students']=G('poster-students').value||'';
  return {
    version:1,
    savedAt:Date.now(),
    mode:currentMode,
    values,
    design:{
      bgColor:G('bg-color')?.value||'#e8f4f8',
      borderColor:G('border-color')?.value||'#b0c4d8',
      qColor:G('q-color')?.value||'#1a1a2e',
      tColor:G('t-color')?.value||'#111111',
      opacity:G('box-opacity')?.value||'96',
      sizes:{...SZ},
      glow:{...glowState},
      bgImage:G('bg-layer')?.style.backgroundImage||'none',
      bgOpacity:G('bg-layer')?.style.opacity||'.18'
    },
    images:{
      main:G('img-main')?.getAttribute('src')||'',
      one:G('img-1')?.getAttribute('src')||'',
      two:G('img-2')?.getAttribute('src')||'',
      logo:G('logo-img')?.getAttribute('src')||''
    }
  };
}
async function saveDraft(){
  if(restoringDraft)return;
  try{await writeAutosave(collectDraft())}catch(error){console.warn('Poster autosave failed',error)}
}
function scheduleAutosave(){
  if(restoringDraft)return;
  clearTimeout(autosaveTimer);
  autosaveTimer=setTimeout(saveDraft,300);
}
function restoreImage(src,imgId,phId){
  const img=G(imgId),ph=G(phId); if(!img||!ph)return;
  if(src){img.src=src;img.classList.add('show');ph.style.display='none'}
  else{img.removeAttribute('src');img.classList.remove('show');ph.style.display='flex'}
}
async function applyDraft(draft){
  restoringDraft=true;
  try{
    Object.entries(draft.values||{}).forEach(([id,value])=>{const el=G(id);if(el)el.value=String(value??'')});
    const d=draft.design||{};
    if(d.bgColor&&G('bg-color'))G('bg-color').value=d.bgColor;
    if(d.borderColor&&G('border-color'))G('border-color').value=d.borderColor;
    if(d.qColor&&G('q-color'))G('q-color').value=d.qColor;
    if(d.tColor&&G('t-color'))G('t-color').value=d.tColor;
    if(d.opacity&&G('box-opacity'))G('box-opacity').value=String(d.opacity);
    Object.assign(SZ,d.sizes||{});
    if(G('h-v'))G('h-v').textContent=SZ.h;
    if(G('q-v'))G('q-v').textContent=SZ.q;
    if(G('t-v'))G('t-v').textContent=SZ.t;
    if(typeof glowState!=='undefined')Object.assign(glowState,d.glow||{});
    if(G('bg-layer')){
      G('bg-layer').style.backgroundImage=d.bgImage||'none';
      G('bg-layer').style.opacity=d.bgOpacity||((d.bgImage&&d.bgImage!=='none')?'1':'.18');
    }
    restoreImage(draft.images?.main,'img-main','img-main-ph');
    restoreImage(draft.images?.one,'img-1','img-1-ph');
    restoreImage(draft.images?.two,'img-2','img-2-ph');
    const logo=G('logo-img');
    if(logo){
      if(draft.images?.logo){logo.src=draft.images.logo;logo.style.display='block';G('logo-txt').style.display='none'}
      else{logo.removeAttribute('src');logo.style.display='none';G('logo-txt').style.display='block'}
    }
    syncNamesToPanel();
    updateAllCombinedFields();
    renderFillPanel();
    qs('.limited').forEach(updateCounterFor);
    autoWidth(G('poster-class'));autoWidth(G('poster-school'));
    applyDesign();
    applyAllGlow();
    currentMode=draft.mode==='digital'?'digital':'physical';
    applyLayout(currentMode);
    fitPreview();
  }finally{
    restoringDraft=false;
  }
}
async function offerRestoreDraft(){
  try{
    const draft=await readAutosave();
    if(!draft)return;
    if(!draft.savedAt||Date.now()-draft.savedAt>AUTOSAVE_MAX_AGE){await clearAutosave();return}
    if(confirm('נמצאה טיוטה של הפוסטר שנשמרה אוטומטית בדפדפן. לשחזר אותה?')) await applyDraft(draft);
    else await clearAutosave();
  }catch(error){console.warn('Poster restore failed',error)}
}
function wireAutosave(){
  document.addEventListener('input',e=>{if(e.target?.matches?.('input,textarea,select'))scheduleAutosave()},true);
  document.addEventListener('change',e=>{if(e.target?.matches?.('input,textarea,select'))scheduleAutosave()},true);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveDraft()});
}
function fitPreview(){
  if(window.matchMedia?.('print')?.matches)return;
  const poster=G('poster'); if(!poster)return;
  const narrow=window.innerWidth<=720;
  const panel=document.body.classList.contains('panel-open')&&!narrow;
  const reserved=panel?380:40;
  const available=Math.max(260,window.innerWidth-reserved);
  const scale=Math.max(.33,Math.min(1,available/824));
  poster.style.zoom=String(scale);
}
function producePdf(){
  saveDraft();
  printTitleBackup=document.title;
  const project=(G('poster-project')?.value||'').trim();
  document.title=project?`${project} - פוסטר חקר`:'פוסטר חקר';
  window.print();
}
'''
s = s.replace(js_anchor, autosave_js, 1)

# 9) Mode/panel actions participate in autosave and responsive preview.
replace_once("function switchMode(mode){currentMode=mode;applyLayout(mode)}", "function switchMode(mode){currentMode=mode;applyLayout(mode);fitPreview();scheduleAutosave()}", 'switch mode')
replace_once("function togglePanel(){document.body.classList.toggle('panel-open')}", "function togglePanel(){document.body.classList.toggle('panel-open');setTimeout(fitPreview,230)}", 'toggle panel')
replace_once(
    "function openTab(name){\n  document.body.classList.add('panel-open');",
    "function openTab(name){\n  document.body.classList.add('panel-open');\n  setTimeout(fitPreview,230);",
    'open tab preview'
)

# 10) Updated labels for physical/digital image slots.
old_labels = r'''function updateImageLabels(mode){
  if(mode==='digital'){
    if(G('img-main-label')) G('img-main-label').textContent='תמונה 1';
    if(G('img-main-note')) G('img-main-note').textContent='לחץ להעלאה';
    if(G('img-1-label')) G('img-1-label').textContent='תמונה 2';
    if(G('img-1-note')) G('img-1-note').textContent='לחץ להעלאה';
    if(G('img-2-label')) G('img-2-label').textContent='תמונה 3';
    if(G('img-2-note')) G('img-2-note').textContent='לחץ להעלאה';
  }else{
    if(G('img-main-label')) G('img-main-label').textContent='תמונה ראשית';
    if(G('img-main-note')) G('img-main-note').textContent='יחס 1:1 בפיזי / מסך טלפון בדיגיטלי';
    if(G('img-1-label')) G('img-1-label').textContent='תמונה 2';
    if(G('img-1-note')) G('img-1-note').textContent='לחץ להעלאה';
    if(G('img-2-label')) G('img-2-label').textContent='תמונה 3';
    if(G('img-2-note')) G('img-2-note').textContent='לחץ להעלאה';
  }
}'''
new_labels = r'''function updateImageLabels(mode){
  if(mode==='digital'){
    if(G('img-main-label')) G('img-main-label').textContent='מסך 1';
    if(G('img-main-note')) G('img-main-note').textContent='לחץ להעלאה';
    if(G('img-1-label')) G('img-1-label').textContent='מסך 2';
    if(G('img-1-note')) G('img-1-note').textContent='לחץ להעלאה';
    if(G('img-2-label')) G('img-2-label').textContent='מסך 3';
    if(G('img-2-note')) G('img-2-note').textContent='לחץ להעלאה';
  }else{
    if(G('img-main-label')) G('img-main-label').textContent='תמונה ראשית';
    if(G('img-main-note')) G('img-main-note').textContent='המוצר / הדגם';
    if(G('img-1-label')) G('img-1-label').textContent='תהליך / אב־טיפוס';
    if(G('img-1-note')) G('img-1-note').textContent='לחץ להעלאה';
    if(G('img-2-label')) G('img-2-label').textContent='שימוש / בדיקה';
    if(G('img-2-note')) G('img-2-note').textContent='לחץ להעלאה';
  }
}'''
replace_once(old_labels, new_labels, 'image label function')

# 11) Autosave after visual/image changes.
replace_once(
    "function setGlow(kind,mode){\n  glowState[kind]=mode;\n  applyGlow(kind);\n}",
    "function setGlow(kind,mode){\n  glowState[kind]=mode;\n  applyGlow(kind);\n  scheduleAutosave();\n}",
    'glow autosave'
)
replace_once(
    "    r.onload=e=>{G('bg-layer').style.backgroundImage=`url(\"${e.target.result}\")`;G('bg-layer').style.opacity='1'};",
    "    r.onload=e=>{G('bg-layer').style.backgroundImage=`url(\"${e.target.result}\")`;G('bg-layer').style.opacity='1';scheduleAutosave()};",
    'background autosave'
)
replace_once(
    "function clearBg(){G('bg-layer').style.backgroundImage='none';G('bg-layer').style.opacity='.18';G('bg-up').value=''}",
    "function clearBg(){G('bg-layer').style.backgroundImage='none';G('bg-layer').style.opacity='.18';G('bg-up').value='';scheduleAutosave()}",
    'clear background autosave'
)
replace_once(
    "  r.onload=e=>{const img=G(imgId);img.src=e.target.result;img.classList.add('show');G(phId).style.display='none'};",
    "  r.onload=e=>{const img=G(imgId);img.src=e.target.result;img.classList.add('show');G(phId).style.display='none';scheduleAutosave()};",
    'image autosave'
)
replace_once(
    "  r.onload=e=>{G('logo-img').src=e.target.result;G('logo-img').style.display='block';G('logo-txt').style.display='none'};",
    "  r.onload=e=>{G('logo-img').src=e.target.result;G('logo-img').style.display='block';G('logo-txt').style.display='none';scheduleAutosave()};",
    'logo autosave'
)

# 12) clearPoster must not duplicate event listeners and must clear the draft.
replace_once(
    "  setParts(1,[]);bindLimits();updateAllCombinedFields();renderFillPanel();\n}",
    "  setParts(1,[]);updateAllCombinedFields();renderFillPanel();clearAutosave();\n}",
    'clear poster duplicate listeners'
)

# Remove obsolete HTML downloader.
s, count = re.subn(r"\nfunction downloadHtml\(\)\{.*?\n\}", '', s, count=1, flags=re.S)
if count != 1:
    raise SystemExit('Missing patch target: downloadHtml function')

# 13) Final initialization: autosave, restore, preview, print cleanup.
replace_once(
    "renderLimitList();\nrenderFillPanel();\nwindow.addEventListener('resize',positionFlowArrows);\napplyLayout('physical');\nautoWidth(G('poster-class'));autoWidth(G('poster-school'));",
    "renderFillPanel();\nwireAutosave();\nwindow.addEventListener('resize',()=>{positionFlowArrows();fitPreview()});\nwindow.addEventListener('beforeprint',()=>{if(G('poster'))G('poster').style.zoom='1'});\nwindow.addEventListener('afterprint',()=>{if(printTitleBackup){document.title=printTitleBackup;printTitleBackup=''}fitPreview()});\napplyLayout('physical');\nautoWidth(G('poster-class'));autoWidth(G('poster-school'));\nfitPreview();\nsetTimeout(offerRestoreDraft,120);",
    'final initialization'
)

# Static safety checks.
assert 'שמור HTML' not in s
assert '>מגבלות</button>' not in s
assert "onclick=\"producePdf()\"" in s
assert 'AUTOSAVE_DB' in s
assert 'flow-to-solution' in s
assert 'body.digital-mode #c-use .numbered-answer{\n  display:flex;\n  flex-direction:row;' in s
assert 'body.digital-mode #c-use .numbered-answer{\n  display:flex;\n  flex-direction:row-reverse;' not in s
assert s.count('bindLimits();') == 1

POSTER.write_text(s, encoding='utf-8')

# Cache bump expected by this project after UI changes.
sw = SW.read_text(encoding='utf-8')
if "premium-static-v47" not in sw:
    raise SystemExit('Expected service worker cache v47')
sw = sw.replace('premium-static-v47', 'premium-static-v48', 1)
SW.write_text(sw, encoding='utf-8')
