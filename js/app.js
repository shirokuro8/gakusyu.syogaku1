"use strict";
/* ================= 学年・ステージ定義 =================
 * 学年を追加するには: GRADES に {id:'g5', label:'5ねんせい', stages:[...]} を追加
 * 各 stage は {id, name, emoji, subject:'kokugo'|'sansu'|'shakai'|'rika', time:秒, gen:関数, count?:問題数}
 * gen() は generators.js の関数を参照する。count を付けると その面だけ 問題数を変えられる。
 */
const GRADES=[
 {id:"g1",label:"１ねんせい",stages:[
   {id:"g1_hira",name:"ひらがな",emoji:"🌸",subject:"kokugo",time:15,gen:()=>emojiWord(HIRA,"ひらがな")},
   {id:"g1_kata",name:"カタカナ",emoji:"🚀",subject:"kokugo",time:15,gen:()=>emojiWord(KATA,"カタカナ")},
   {id:"g1_kr",name:"かんじ よみ",emoji:"📖",subject:"kokugo",time:15,gen:idx=>kanjiReadMix(KANJI1,JUKUGO1,idx)},
   {id:"g1_kw",name:"かんじ かき",emoji:"✏️",subject:"kokugo",time:15,gen:idx=>kanjiWriteMix(KANJI1,JUKUGO1,idx)},
   {id:"g1_calc",name:"たしざん ひきざん",emoji:"🔢",subject:"sansu",time:15,gen:g1calc},
   {id:"g1_word",name:"ぶんしょうだい",emoji:"🧺",subject:"sansu",time:35,count:5,gen:g1word},
   {id:"g1_carry",name:"くりあがり けいさん",emoji:"🔥",subject:"sansu",time:18,gen:g1carry},
   {id:"g1_clock",name:"とけい",emoji:"🕒",subject:"sansu",time:15,gen:g1clock},
   {id:"g1_three",name:"３つの かず",emoji:"🎲",subject:"sansu",time:18,gen:g1three},
 ]},
 {id:"g2",label:"２ねんせい",stages:[
   {id:"g2_kr",name:"かん字 よみ",emoji:"📗",subject:"kokugo",time:15,gen:idx=>kanjiReadMix(KANJI2,JUKUGO2,idx)},
   {id:"g2_kw",name:"かん字 かき",emoji:"🖊️",subject:"kokugo",time:15,gen:idx=>kanjiWriteMix(KANJI2,JUKUGO2,idx)},
   {id:"g2_oppo",name:"はんたい ことば",emoji:"↔️",subject:"kokugo",time:15,gen:opposite},
   {id:"g2_kuku",name:"九九",emoji:"⚡",subject:"sansu",time:12,gen:kuku},
   {id:"g2_hissan",name:"ひっさん",emoji:"🧮",subject:"sansu",time:20,gen:hissan},
   {id:"g2_len",name:"ながさ",emoji:"📏",subject:"sansu",time:18,gen:g2len},
   {id:"g2_vol",name:"かさ",emoji:"🧃",subject:"sansu",time:18,gen:g2vol},
   {id:"g2_time",name:"時こくと時間",emoji:"⏰",subject:"sansu",time:20,gen:g2time},
   {id:"g2_num",name:"1000までの かず",emoji:"💯",subject:"sansu",time:18,gen:g2num},
   {id:"g2_frac",name:"ぶんすう",emoji:"🍕",subject:"sansu",time:18,gen:g2frac},
 ]},
 {id:"g3",label:"３ねんせい",stages:[
   {id:"g3_kr",name:"かん字 よみ",emoji:"📘",subject:"kokugo",time:15,gen:()=>kanjiRead(KANJI3)},
   {id:"g3_kw",name:"かん字 かき",emoji:"🖋️",subject:"kokugo",time:15,gen:()=>kanjiWrite(KANJI3)},
   {id:"g3_romaji",name:"ローマ字",emoji:"🔤",subject:"kokugo",time:15,gen:romaji},
   {id:"g3_map",name:"地図記号",emoji:"🗺️",subject:"shakai",time:15,gen:mapSym},
   {id:"g3_safety",name:"安全なくらし",emoji:"🚸",subject:"shakai",time:18,gen:()=>qa(SAFETY)},
   {id:"g3_div",name:"わり算",emoji:"➗",subject:"sansu",time:15,gen:g3div},
   {id:"g3_divr",name:"あまりのあるわり算",emoji:"🍰",subject:"sansu",time:20,gen:g3divR},
   {id:"g3_mul",name:"かけ算の筆算",emoji:"🧮",subject:"sansu",time:20,gen:g3mul},
   {id:"g3_big",name:"大きな数",emoji:"🔢",subject:"sansu",time:18,gen:g3bignum},
   {id:"g3_dec",name:"小数",emoji:"🔟",subject:"sansu",time:18,gen:g3decimal},
   {id:"g3_frac",name:"分数の基礎",emoji:"🍕",subject:"sansu",time:18,gen:g3frac},
   {id:"g3_lw",name:"長さ・重さ",emoji:"⚖️",subject:"sansu",time:18,gen:g3lenweight},
   {id:"g3_tm",name:"時間と秒",emoji:"⏱️",subject:"sansu",time:18,gen:g3time},
   {id:"g3_shape",name:"円と球と三角形",emoji:"🔺",subject:"sansu",time:18,gen:g3shape},
   {id:"g3_insect",name:"こん虫",emoji:"🐛",subject:"rika",time:18,gen:()=>qa(INSECT)},
   {id:"g3_plant",name:"しょくぶつ",emoji:"🌱",subject:"rika",time:18,gen:()=>qa(PLANT)},
   {id:"g3_wind",name:"風とゴム",emoji:"🎐",subject:"rika",time:18,gen:()=>qa(WINDRUBBER)},
   {id:"g3_light",name:"光と音",emoji:"🔦",subject:"rika",time:18,gen:()=>qa(LIGHTSOUND)},
   {id:"g3_magnet",name:"じしゃく",emoji:"🧲",subject:"rika",time:18,gen:()=>qa(MAGNET)},
   {id:"g3_elec",name:"電気",emoji:"🔋",subject:"rika",time:18,gen:()=>qa(ELECTRIC)},
   {id:"g3_sun",name:"太陽とかげ",emoji:"☀️",subject:"rika",time:18,gen:()=>qa(SUNSHADOW)},
 ]},
 {id:"g4",label:"４ねんせい",stages:[
   {id:"g4_kr",name:"かん字 よみ",emoji:"📕",subject:"kokugo",time:15,gen:()=>kanjiRead(KANJI4)},
   {id:"g4_kw",name:"かん字 かき",emoji:"🖋️",subject:"kokugo",time:15,gen:()=>kanjiWrite(KANJI4)},
   {id:"g4_idiom",name:"ことわざ・かん用句",emoji:"🦊",subject:"kokugo",time:20,gen:idiom},
   {id:"g4_eigo",name:"えいご",emoji:"🌍",subject:"eigo",time:15,gen:()=>emojiWord(ENGLISH4,"えいご")},
   {id:"g4_pref",name:"都道府県",emoji:"🗾",subject:"shakai",time:18,gen:()=>qa(PREF4)},
   {id:"g4_water",name:"水はどこから",emoji:"🚰",subject:"shakai",time:18,gen:()=>qa(WATER4)},
   {id:"g4_gomi",name:"ごみの ゆくえ",emoji:"🗑️",subject:"shakai",time:18,gen:()=>qa(GOMI4)},
   {id:"g4_disaster",name:"自然災害から くらしを守る",emoji:"⛑️",subject:"shakai",time:18,gen:()=>qa(DISASTER4)},
   {id:"g4_big",name:"大きな数（億・兆）",emoji:"🌌",subject:"sansu",time:18,gen:g4bignum},
   {id:"g4_div",name:"2けたで わるわり算",emoji:"➗",subject:"sansu",time:20,gen:g4div2},
   {id:"g4_round",name:"がい数（四捨五入）",emoji:"🎯",subject:"sansu",time:20,gen:g4round},
   {id:"g4_dec",name:"小数の計算",emoji:"📐",subject:"sansu",time:20,gen:g4decimal},
   {id:"g4_frac",name:"分数（仮分数・帯分数）",emoji:"🍰",subject:"sansu",time:20,gen:g4frac},
   {id:"g4_angle",name:"角の大きさ",emoji:"📐",subject:"sansu",time:15,gen:g4angle},
   {id:"g4_area",name:"面積",emoji:"⬛",subject:"sansu",time:20,gen:g4area},
   {id:"g4_season",name:"季節と生き物",emoji:"🍂",subject:"rika",time:18,gen:()=>qa(SEASON4)},
   {id:"g4_weather",name:"天気と気温",emoji:"🌤️",subject:"rika",time:18,gen:()=>qa(WEATHER4)},
   {id:"g4_elec",name:"電気のはたらき",emoji:"🔌",subject:"rika",time:18,gen:()=>qa(ELECTRIC4)},
   {id:"g4_moon",name:"月と星",emoji:"🌛",subject:"rika",time:18,gen:()=>qa(MOONSTAR4)},
   {id:"g4_air",name:"とじこめた空気と水",emoji:"💨",subject:"rika",time:18,gen:()=>qa(AIRWATER4)},
   {id:"g4_body",name:"人の体のつくり",emoji:"🦴",subject:"rika",time:18,gen:()=>qa(BODY4)},
 ]},
];
const Q_PER_STAGE=10;
/* ================= 特別枠：偉人・名言 =================
 * 学年に関係なく ホーム画面に 常に表示される 科目。
 * 「偉人」単元の次に「名言」単元を追加する場合も この配列に足す。
 * 各要素は GRADES の stage と同じ形（id, name, emoji, subject, time, gen, count）。
 */
const IJIN_STAGES=[
 {id:"ijin_person",name:"偉人",emoji:"👑",subject:"ijin",time:40,count:5,gen:()=>ijinPerson(IJIN)},
 {id:"meigen_koshi",name:"孔子",emoji:"📜",subject:"ijin",time:60,count:5,gen:()=>qa(MEIGEN_KOSHI)},
 {id:"meigen_shaka",name:"釈迦",emoji:"🪷",subject:"ijin",time:60,count:5,gen:()=>qa(MEIGEN_SHAKA)},
 {id:"meigen_socrates",name:"ソクラテス",emoji:"🏛️",subject:"ijin",time:60,count:5,gen:()=>qa(MEIGEN_SOCRATES)},
 {id:"meigen_jesus",name:"イエス・キリスト",emoji:"✝️",subject:"ijin",time:60,count:5,gen:()=>qa(MEIGEN_JESUS)},
];
/* ゲーム（それぞれ games/ フォルダの別HTMLをiframeで開く） */
/* cost: 1回あそぶのに ひつような ゲームチケットの まいすう（省略時は1） */
const EXTRA_GAMES=[
 {title:"ぴょんぴょんロケット", emoji:"🚀", src:"games/pyonpyon-rocket.html", cost:1},
 {title:"ジャンプランナー", emoji:"🦖", src:"games/jump-runner.html", cost:1},
 {title:"きらきらロケット", emoji:"🚀", src:"games/kirakira-rocket.html", cost:3},
 {title:"JUMP HERO", emoji:"🦸", src:"games/jump-hero-6.html", cost:3},
];
/* ================= 保存（localStorage） ================= */
const KEY="bq2_data";
const MAX_TICKETS=5;      // ためられる チケットの上限
const TICKET_LIVES=3;     // チケット1まいで あそべる回数（ゲームオーバー3回で終了）
const WRONG_NOTE_GOAL=5;  // まちがいノートの もんだいを これだけ正解すると チケット1まい
let DB=load();
function load(){
  const def={v:2,grade:"g1",stars:{},best:{},stats:{},hist:[],wrong:[],streak:{last:"",n:0},mute:false,
    tickets:0,wrongProg:0};
  try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===2)return Object.assign(def,d)}catch(e){}
  return def;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
function today(){return new Date().toISOString().slice(0,10)}
function bumpStreak(){const t=today();if(DB.streak.last===t)return;
  const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
  DB.streak.n=(DB.streak.last===y)?DB.streak.n+1:1;DB.streak.last=t;}
/* ── ゲームチケット ── */
function grantTickets(qualifies){                          // 条件を みたせば 必ず チケットを1まい発行（上限まで）
  if(!qualifies||(DB.tickets||0)>=MAX_TICKETS)return 0;
  DB.tickets=(DB.tickets||0)+1;return 1;}
/* まちがいノート: まちがえた問題を WRONG_NOTE_GOAL 問 正解するたびに チケット1まい */
function grantWrongNoteTickets(correctCount){DB.wrongProg=(DB.wrongProg||0)+correctCount;let earned=0;
  while(DB.wrongProg>=WRONG_NOTE_GOAL&&(DB.tickets||0)<MAX_TICKETS){DB.wrongProg-=WRONG_NOTE_GOAL;DB.tickets=(DB.tickets||0)+1;earned++;}
  if((DB.tickets||0)>=MAX_TICKETS)DB.wrongProg=Math.min(DB.wrongProg,WRONG_NOTE_GOAL-1);
  return earned;}
/* ================= 効果音 ================= */
let AC=null;
function beep(f,d=.12,type="sine"){if(DB.mute)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);
  o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+d);}catch(e){}}
const sOK=()=>{beep(880,.1);setTimeout(()=>beep(1320,.15),90)};
const sNG=()=>beep(180,.3,"square");
/* ================= 画面遷移 ================= */
const app=$("#app");
let quiz=null, timerId=null;
function go(screen,arg){stopTimer();
  ({home:renderHome,quiz:startQuiz,result:renderResult,record:renderRecord,
    games:renderGames,review:startReview,physics:renderPhysics})[screen](arg);
  window.scrollTo(0,0);}
function curGrade(){return GRADES.find(g=>g.id===DB.grade)||GRADES[0]}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
/* {かん字|かんじ} 記法を <ruby> タグに変換（ふりがな表示。データ側は generators.js/data-*.js を参照） */
function furi(s){return esc(s).replace(/\{([^{}|]+)\|([^{}|]+)\}/g,"<ruby>$1<rt>$2</rt></ruby>")}
/* ── ホーム ── */
function renderHome(){
  document.body.dataset.grade=DB.grade;
  const g=curGrade();
  let tot=0,cor=0,starSum=0;const todayHist=DB.hist.filter(h=>h.d===today());
  g.stages.forEach(s=>{const st=DB.stats[s.id];if(st){tot+=st.t;cor+=st.c}starSum+=DB.stars[s.id]||0;});
  const acc=tot?Math.round(cor/tot*100):0;
  const CIRC=2*Math.PI*42;
  const secRow=(sub,label,color)=>{
    const items=g.stages.filter(s=>s.subject===sub);
    if(!items.length)return "";
    return `<div class="sec-h"><span class="bar" style="background:${color}"></span>${label}</div>
    <div class="grid">${items.map(s=>`
      <button class="stage ${s.subject} focusable" data-act="stage" data-id="${s.id}">
        <span class="em">${s.emoji}</span><span class="nm">${s.name}</span>
        <div class="st">${"⭐".repeat(DB.stars[s.id]||0)||"　"}</div>
      </button>`).join("")}</div>`;};
  app.innerHTML=`
  <div class="top">
    <div class="logo">べんきょう<span>クエスト</span></div>
    <div class="topchips">
      <div class="star-chip"><em>⭐</em> ${GRADES.reduce((a,gr)=>a+gr.stages.reduce((b,s)=>b+(DB.stars[s.id]||0),0),0)}</div>
      <div class="ticket-chip"><em>🎟️</em> ${DB.tickets||0}</div>
    </div>
  </div>
  <div class="tabs">${GRADES.map(gr=>`
    <button class="tab focusable ${gr.id===DB.grade?"on":""}" data-act="grade" data-id="${gr.id}">${gr.label}</button>`).join("")}
  </div>
  <div class="greet">きょうも がんばろう！</div>
  <div class="dash">
    <div class="ring-wrap">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="42" fill="none" stroke-width="11"/>
        <circle class="ring-fg" cx="50" cy="50" r="42" fill="none" stroke-width="11"
          stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC*(1-acc/100)}"/>
      </svg>
      <div class="ring-num"><b>${acc}<small style="font-size:.8rem">%</small></b><small>せいかいりつ</small></div>
    </div>
    <div class="dash-stats">
      <div class="dstat"><b>⭐${starSum}</b><small>この学年の星</small></div>
      <div class="dstat"><b>🔥${DB.streak.n}</b><small>れんぞく日</small></div>
      <div class="dstat"><b>${todayHist.reduce((a,h)=>a+h.n,0)}</b><small>きょうの問題</small></div>
    </div>
  </div>
  ${DB.wrong.length?`
  <button class="review-card focusable" data-act="review">
    <span class="em">📓</span>
    <span class="tx"><b>まちがいノート</b>
      <small>まちがえた もんだいが ${DB.wrong.length}こ。${WRONG_NOTE_GOAL}問 正解で 🎟️チケットが もらえるよ！</small></span>
    <span class="go">ふくしゅう →</span>
  </button>`:`
  <div class="review-card done">
    <span class="em">✅</span>
    <span class="tx"><b>まちがいノート</b>
      <small>いまは まちがいが ないよ！この ちょうしで がんばろう！</small></span>
  </div>`}
  ${secRow("kokugo","こくご","var(--kokugo)")}
  ${secRow("shakai","しゃかい","var(--shakai)")}
  ${secRow("sansu","さんすう","var(--sansu)")}
  ${secRow("rika","りか","var(--rika)")}
  ${secRow("eigo","えいご","var(--eigo)")}
  <div class="sec-h"><span class="bar" style="background:var(--ijin)"></span>偉人・名言</div>
  <div class="grid">${IJIN_STAGES.map(s=>`
    <button class="stage ${s.subject} focusable" data-act="specialstage" data-id="${s.id}">
      <span class="em">${s.emoji}</span><span class="nm">${s.name}</span>
      <div class="st">${"⭐".repeat(DB.stars[s.id]||0)||"　"}</div>
    </button>`).join("")}</div>
  <div class="sec-h"><span class="bar" style="background:var(--fun)"></span>おたのしみ</div>
  <div class="grid">
    <button class="stage fun focusable" data-act="games">
      <span class="em">🎮</span><span class="nm">ゲームひろば</span>
      <div class="st">🎟️ ${DB.tickets||0}まい</div></button>
    <button class="stage fun focusable" data-act="physics">
      <span class="em">🔬</span><span class="nm">ぶつりラボ</span>
      <div class="st">シミュレーション</div></button>
  </div>
  <div class="rowbtns">
    <button class="bigbtn focusable" data-act="record">📊 きろくを みる</button>
    <button class="bigbtn focusable" data-act="mute">${DB.mute?"🔇 おとを だす":"🔊 おとを けす"}</button>
  </div>`;
}
/* ── クイズ ── */
function startQuiz(stage){
  const N=stage.count||Q_PER_STAGE;
  const qs=[];const seen=new Set();let guard=0;
  while(qs.length<N&&guard++<200){
    const q=stage.gen(qs.length,N);if(seen.has(q.q+(q.big||"")))continue;seen.add(q.q+(q.big||""));qs.push(q);}
  quiz={stage,qs,i:0,cor:0,score:0,t0:Date.now(),wrongList:[]};
  renderQ();
}
function startReview(){
  if(!DB.wrong.length){renderHome();return}
  const items=shuffle(DB.wrong).slice(0,Q_PER_STAGE);
  const stage={id:"review",name:"まちがいノート",emoji:"📓",time:20,review:true};
  quiz={stage,qs:items.map(w=>w.q),i:0,cor:0,score:0,t0:Date.now(),wrongList:[],reviewSrc:items};
  renderQ();
}
function renderQ(){
  const {stage,qs,i}=quiz;const q=qs[i];
  app.innerHTML=`
  <div class="quiz-top">
    <button class="back focusable" data-act="home" style="margin:0">← やめる</button>
    <span>${stage.emoji} ${stage.name}</span>
    <span class="qcount">${i+1} / ${qs.length}</span>
  </div>
  <div class="timerbar"><i id="tbar" style="width:100%"></i></div>
  <div class="qcard">
    <div class="qtext">${furi(q.q).replace(/\n/g,"<br>")}</div>
    ${q.big?`<div class="qbig">${furi(q.big)}</div>`:""}
  </div>
  <div class="choices">${q.choices.map((c,ci)=>`
    <button class="choice focusable" data-act="ans" data-i="${ci}">${furi(c)}</button>`).join("")}
  </div>`;
  startTimer(stage.time);
  quiz.qStart=Date.now();
}
function startTimer(sec){stopTimer();const bar=$("#tbar");const t0=Date.now();
  timerId=setInterval(()=>{const r=1-(Date.now()-t0)/(sec*1000);
    if(r<=0){stopTimer();answer(-1);return}
    bar.style.width=(r*100)+"%";
    bar.style.background=r>.5?"var(--ok)":r>.25?"var(--star)":"var(--ng)";},100);}
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
function answer(ci){stopTimer();
  const q=quiz.qs[quiz.i];const ok=ci===q.answer;
  document.querySelectorAll(".choice").forEach((b,bi)=>{
    if(bi===q.answer)b.classList.add("ok");
    else if(bi===ci)b.classList.add("ng");
    b.disabled=true;});
  const fb=document.createElement("div");fb.className="feedback";
  fb.textContent=ok?"⭕":"❌";document.body.appendChild(fb);
  if(ok){sOK();quiz.cor++;
    const el=(Date.now()-quiz.qStart)/1000;const lim=quiz.stage.time;
    quiz.score+=100+Math.max(0,Math.round((lim-el)/lim*50));}
  else{sNG();quiz.wrongList.push({q,stageId:quiz.stage.id});}
  setTimeout(()=>{fb.remove();
    quiz.i++;
    if(quiz.i<quiz.qs.length)renderQ();else finishQuiz();},900);}
function finishQuiz(){
  const {stage,qs,cor,score,wrongList}=quiz;
  const acc=Math.round(cor/qs.length*100);
  const stars=acc>=90?3:acc>=70?2:acc>=50?1:0;
  bumpStreak();
  let ticketEarned=0;
  if(!stage.review){
    const prevBest=DB.best[stage.id]||0;
    const isFirstClear=prevBest===0;                           // このステージ、はじめてのクリア
    const isNewRecord=score>=prevBest;                          // 自己ベスト タイ or 更新
    const isHighAcc=acc>=90;                                    // せいかい率 9割いじょう
    // 初回クリアは 半分(50%)以上正解、2回目いこうは 自己ベスト更新 か 9割いじょうなら 何度でもOK
    const qualifies=isFirstClear?acc>=50:(isNewRecord||isHighAcc);
    DB.stars[stage.id]=Math.max(DB.stars[stage.id]||0,stars);
    DB.best[stage.id]=Math.max(prevBest,score);
    const st=DB.stats[stage.id]||{c:0,t:0};st.c+=cor;st.t+=qs.length;DB.stats[stage.id]=st;
    const wrongGateActive=DB.wrong.length>=10;                 // まちがい10以上は付与停止(ノート優先)
    // 条件を みたせば 必ず チケットを1まい発行
    ticketEarned=grantTickets(qualifies&&!wrongGateActive);
    quiz.isFirstClear=isFirstClear;quiz.isNewRecord=isNewRecord;quiz.isHighAcc=isHighAcc;quiz.prevBest=prevBest;
    quiz.wrongGateActive=wrongGateActive;
  }else{ // まちがいノート: 正解した問題はノートから除去し、正解数に応じてチケットを付与
    const solved=new Set(qs.filter((q,i2)=>!wrongList.find(w=>w.q===q)).map(q=>q.q+(q.big||"")));
    DB.wrong=DB.wrong.filter(w=>!solved.has(w.q.q+(w.q.big||"")));
    ticketEarned=grantWrongNoteTickets(solved.size);
  }
  wrongList.forEach(w=>{if(DB.wrong.length<60&&!DB.wrong.find(x=>x.q.q===w.q.q&&x.q.big===w.q.big))DB.wrong.push(w)});
  DB.hist.unshift({d:today(),g:DB.grade,s:stage.name,acc,score,n:qs.length});
  DB.hist=DB.hist.slice(0,100);
  save();
  renderResult({stage,acc,cor,total:qs.length,score,stars,time:Math.round((Date.now()-quiz.t0)/1000),
    ticketEarned,tickets:DB.tickets||0,
    isFirstClear:quiz.isFirstClear,isNewRecord:quiz.isNewRecord,isHighAcc:quiz.isHighAcc,prevBest:quiz.prevBest||0,
    wrongGateActive:quiz.wrongGateActive||false});
}
function renderResult(r){
  const msg=r.acc>=90?"すごい！パーフェクトきゅう！":r.acc>=70?"よくできました！":r.acc>=50?"がんばったね！":"もういちど ちょうせんしよう！";
  let tk="";
  if(!r.stage.review){
    if(r.ticketEarned>0){
      const badge=r.isFirstClear?"🎉 はじめてクリア！":r.isNewRecord?"🏆 じこベスト こうしん！":"🌟 9割いじょう せいかい！";
      tk=`<div class="tk-box tk-got">
        <div class="tk-badge">${badge}</div>
        🎟️ ゲームチケットを ゲット！
        <small>もっている チケット：${r.tickets}まい</small></div>`;
    }else if(r.wrongGateActive){
      tk=`<div class="tk-box">🎟️ こんかいは チケットは もらえなかったよ
        <small>まちがいノートが 10もん いじょう。さきに ふくしゅうしよう！</small></div>`;
    }else if(r.isFirstClear){
      tk=`<div class="tk-box">🎟️ こんかいは チケットは もらえなかったよ
        <small>せいかい 50% いじょうで もらえるよ</small></div>`;
    }else{
      tk=`<div class="tk-box">🎟️ こんかいは チケットは もらえなかったよ
        <small>じこベスト(${r.prevBest}点)を こえるか、9割いじょう せいかいすると もらえるよ</small></div>`;
    }
  }else{
    if(r.ticketEarned>0){
      tk=`<div class="tk-box tk-got">🎟️ まちがいノートを がんばったので ゲームチケットを ゲット！
        <small>もっている チケット：${r.tickets}まい</small></div>`;
    }else{
      tk=`<div class="tk-box">🎟️ こんかいは チケットは もらえなかったよ
        <small>まちがえた 問題を ${WRONG_NOTE_GOAL}問 正解すると ゲームチケットが もらえるよ</small></div>`;
    }
  }
  app.innerHTML=`
  <div class="res">
    <h2>${r.stage.emoji} ${r.stage.name} クリア！</h2>
    <div class="res-stars">${"⭐".repeat(r.stars)}${"☆".repeat(3-r.stars)}</div>
    <div style="font-weight:800;font-size:1.1rem">${msg}</div>
    <div class="res-grid">
      <div class="rstat"><b>${r.cor}/${r.total}</b><small>せいかい</small></div>
      <div class="rstat"><b>${r.score}</b><small>スコア</small></div>
      <div class="rstat"><b>${r.time}秒</b><small>タイム</small></div>
    </div>
    ${tk}
    <div class="rowbtns">
      <button class="bigbtn focusable" data-act="retry">🔁 もういちど</button>
      <button class="bigbtn focusable" data-act="home">🏠 ホーム</button>
    </div>
  </div>`;
  window._lastStage=r.stage;
}
/* ── きろく ── */
function renderRecord(){
  const rows=GRADES.map(g=>{
    const inner=g.stages.map(s=>{
      const st=DB.stats[s.id];const acc=st&&st.t?Math.round(st.c/st.t*100):null;
      return `<div class="rec-row"><span class="nm">${s.emoji} ${s.name}</span>
        <div class="bar-bg"><div class="bar-fg" style="width:${acc||0}%"></div></div>
        <span class="pc">${acc===null?"ー":acc+"%"}</span></div>`;}).join("");
    return `<div class="rec-card"><div style="font-weight:800;margin-bottom:.4rem">${g.label}</div>${inner}</div>`;
  }).join("");
  const ijinInner=IJIN_STAGES.map(s=>{
    const st=DB.stats[s.id];const acc=st&&st.t?Math.round(st.c/st.t*100):null;
    return `<div class="rec-row"><span class="nm">${s.emoji} ${s.name}</span>
      <div class="bar-bg"><div class="bar-fg" style="width:${acc||0}%"></div></div>
      <span class="pc">${acc===null?"ー":acc+"%"}</span></div>`;}).join("");
  const ijinCard=`<div class="rec-card"><div style="font-weight:800;margin-bottom:.4rem">偉人・名言</div>${ijinInner}</div>`;
  const hist=DB.hist.slice(0,15).map(h=>
    `<div class="hist">${h.d}　${h.s}　${h.acc}%　${h.score}点</div>`).join("")||`<div class="empty">まだ きろくが ないよ</div>`;
  app.innerHTML=`
  <button class="back focusable" data-act="home">← もどる</button>
  <div class="pagetitle">📊 きろく</div>
  ${rows}
  ${ijinCard}
  <div class="rec-card"><div style="font-weight:800;margin-bottom:.4rem">さいきんの きろく</div>${hist}</div>`;
}
/* ── ゲームひろば ── */
function renderGames(){
  const extras=EXTRA_GAMES.map((g,i)=>`
    <button class="stage fun focusable" data-act="extgame" data-i="${i}">
      <span class="em">${g.emoji}</span><span class="nm">${g.title}</span>
      <div class="st">🎟️${g.cost||1}まい</div></button>`).join("");
  app.innerHTML=`
  <button class="back focusable" data-act="home">← もどる</button>
  <div class="pagetitle">🎮 ゲームひろば</div>
  <div class="tk-box" style="text-align:center">🎟️ ゲームチケット ${DB.tickets||0}まい
    <small>チケットを つかうと ${TICKET_LIVES}回まで あそべるよ（ゲームによって ひつような まいすうが ちがうよ）</small></div>
  <div class="grid">
    ${extras}
  </div>
  <div class="game-hint">タップ / スペース / 決定ボタンで あそべるよ！</div>`;
}
/* ── 外部ゲーム(iframe): チケット1まい=ゲームオーバー3回まで ── */
function openExt(i){const g=EXTRA_GAMES[i];if(!g)return;
  const cost=g.cost||1;
  if((DB.tickets||0)<cost){              // チケットが たりなければ 遊べない
    const m=document.createElement("div");m.className="modal";
    m.innerHTML=`
    <div class="noticket">
      <div style="font-size:3rem">🎟️❌</div>
      <h2 style="margin:.3rem 0">チケットが ${cost}まい ひつようだよ</h2>
      <div style="font-weight:800;margin:.6rem 0 1rem">いま ${DB.tickets||0}まい もっているよ。<br>クイズで 新記ろくを だすと<br>ゲームチケットが もらえるよ！</div>
      <button class="bigbtn focusable noticket-close">🎮 とじる</button>
    </div>`;
    m.querySelector(".noticket-close").onclick=()=>m.remove();
    document.body.appendChild(m);
    return;
  }
  DB.tickets-=cost;save();               // チケットを cost まい消費（開始時に消費）
  let lives=TICKET_LIVES;
  const m=document.createElement("div");m.className="modal";
  m.innerHTML=`
  <div class="stage">
    <div class="ext-hud">${"❤️".repeat(lives)}</div>
    <iframe src="${g.src}"></iframe>
    <div class="ext-over hidden">
      <div style="font-size:2.6rem">🎮</div>
      <h2>おしまい！</h2>
      <div>また クイズで チケットを あつめてね</div>
      <button class="bigbtn focusable ext-over-close">🎮 ゲームひろば</button>
    </div>
  </div>
  <button class="close">✕</button>`;
  const hudEl=m.querySelector(".ext-hud");
  const overEl=m.querySelector(".ext-over");
  const iframeEl=m.querySelector("iframe");
  function onMsg(e){
    if(!e.data||e.data.type!=="BQ_GAME_OVER")return;
    if(e.source!==iframeEl.contentWindow)return;   // このiframe以外からの通知は無視
    lives=Math.max(0,lives-1);
    hudEl.textContent="❤️".repeat(lives)||"💔";
    if(lives<=0){
      overEl.classList.remove("hidden");
      iframeEl.style.pointerEvents="none";          // これ以上あそべないようにする
    }
  }
  function cleanup(){window.removeEventListener("message",onMsg);m.remove();}
  window.addEventListener("message",onMsg);
  m.querySelector(".close").onclick=cleanup;
  m.querySelector(".ext-over-close").onclick=cleanup;
  document.body.appendChild(m);}
/* ================= ぶつりラボ（各シミュレーションは physics/ フォルダの別HTMLをiframeで開く） ================= */
const PHYSICS_SIMS=[
 {title:"にじゅうふりこ", emoji:"🌀", tag:"カオス", src:"physics/pendulum.html"},
 {title:"りゅうたい", emoji:"🌊", tag:"しょうがいぶつ", src:"physics/fluid.html"},
 {title:"わくせいの うごき", emoji:"🪐", tag:"じゅうりょく", src:"physics/orbit.html"},
 {title:"1000にんの こうさてん", emoji:"🚶", tag:"ぶんさんせいぎょ", src:"physics/swarm.html"},
 {title:"げんの しんどうと おと", emoji:"🎻", tag:"サウンド", src:"physics/string.html"},
 {title:"じゅうたいの ふしぎ", emoji:"🚗", tag:"なみ", src:"physics/traffic.html"},
 {title:"ありの えさはこび", emoji:"🐜", tag:"フェロモン", src:"physics/ant.html"},
 {title:"ゆきの けっしょう", emoji:"❄️", tag:"せいちょう", src:"physics/snowflake.html"},
];
function renderPhysics(){
  const items=PHYSICS_SIMS.map((p,i)=>`
    <button class="stage fun focusable" data-act="physicssim" data-i="${i}">
      <span class="em">${p.emoji}</span><span class="nm">${p.title}</span>
      <div class="st">${p.tag}</div></button>`).join("");
  app.innerHTML=`
  <button class="back focusable" data-act="home">← もどる</button>
  <div class="pagetitle">🔬 ぶつりラボ</div>
  <div class="grid">${items}</div>
  <div class="sim-desc">ほんものの ぶつりの ルールで うごく シミュレーションだよ。さわって いろいろ ためして みよう！</div>`;
}
/* ── シミュレーションをiframeで開く（学習用のため ゲームチケットは消費しない） ── */
function openPhysicsSim(i){const p=PHYSICS_SIMS[i];if(!p)return;
  const m=document.createElement("div");m.className="modal";
  m.innerHTML=`
  <div class="stage">
    <iframe src="${p.src}"></iframe>
  </div>
  <button class="close">✕</button>`;
  m.querySelector(".close").onclick=()=>m.remove();
  document.body.appendChild(m);}
/* ================= イベント委譲 ================= */
app.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.dataset.act;
  if(act==="grade"){DB.grade=b.dataset.id;save();renderHome();}
  else if(act==="stage"){const s=curGrade().stages.find(x=>x.id===b.dataset.id)
    ||GRADES.flatMap(g=>g.stages).find(x=>x.id===b.dataset.id);go("quiz",s);}
  else if(act==="specialstage"){const s=IJIN_STAGES.find(x=>x.id===b.dataset.id);if(s)go("quiz",s);}
  else if(act==="ans")answer(+b.dataset.i);
  else if(act==="home")go("home");
  else if(act==="retry")go("quiz",window._lastStage);
  else if(act==="record")go("record");
  else if(act==="games")go("games");
  else if(act==="physics")go("physics");
  else if(act==="review")go("review");
  else if(act==="extgame")openExt(+b.dataset.i);
  else if(act==="physicssim")openPhysicsSim(+b.dataset.i);
  else if(act==="mute"){DB.mute=!DB.mute;save();renderHome();}
});
/* ================= TVリモコン/キーボード 空間ナビゲーション ================= */
document.addEventListener("keydown",e=>{
  const keys=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"];
  if(!keys.includes(e.key))return;
  const els=[...document.querySelectorAll(".focusable:not(:disabled)")];
  if(!els.length)return;
  let cur=document.activeElement;
  if(!els.includes(cur)){els[0].focus();return}
  if(e.key==="Enter")return; // ネイティブclickに任せる
  e.preventDefault();
  const cr=cur.getBoundingClientRect();
  const cx=cr.left+cr.width/2, cy=cr.top+cr.height/2;
  let best=null,bd=1e9;
  els.forEach(el=>{if(el===cur)return;
    const r=el.getBoundingClientRect();
    const x=r.left+r.width/2, y=r.top+r.height/2;
    const dx=x-cx, dy=y-cy;
    const dirOK=(e.key==="ArrowUp"&&dy<-5)||(e.key==="ArrowDown"&&dy>5)
      ||(e.key==="ArrowLeft"&&dx<-5)||(e.key==="ArrowRight"&&dx>5);
    if(!dirOK)return;
    const vert=e.key==="ArrowUp"||e.key==="ArrowDown";
    const d=vert?Math.abs(dy)+Math.abs(dx)*2.5:Math.abs(dx)+Math.abs(dy)*2.5;
    if(d<bd){bd=d;best=el}});
  if(best)best.focus();
});
/* ================= 起動 ================= */
renderHome();
