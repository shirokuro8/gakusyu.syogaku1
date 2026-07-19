"use strict";
/* ================= 学年・ステージ定義 =================
 * 学年を追加するには: 下に G5_STAGES を定義し、末尾の GRADES に
 *   {id:'g5', label:'5ねんせい', stages:[...G5_STAGES, g5SougouStage]} を追加する
 *   （g5SougouStage は makeSougouGen(G5_STAGES) で作る。総合問題の節を参照）
 * 各 stage は {id, name, emoji, subject:'kokugo'|'sansu'|'shakai'|'rika'|'eigo'|'sougou', time:秒, gen:関数, count?:問題数}
 * gen() は generators.js の関数を参照する。count を付けると その面だけ 問題数を変えられる。
 */
const G1_STAGES=[
   {id:"g1_hira",name:"ひらがな",emoji:"🌸",subject:"kokugo",time:15,gen:()=>emojiWord(HIRA,"ひらがな")},
   {id:"g1_kata",name:"カタカナ",emoji:"🚀",subject:"kokugo",time:15,gen:()=>emojiWord(KATA,"カタカナ")},
   {id:"g1_kr",name:"かんじ よみ",emoji:"📖",subject:"kokugo",time:15,gen:idx=>kanjiReadMix(KANJI1,JUKUGO1,idx)},
   {id:"g1_kw",name:"かんじ かき",emoji:"✏️",subject:"kokugo",time:15,gen:idx=>kanjiWriteMix(KANJI1,JUKUGO1,idx)},
   {id:"g1_calc",name:"たしざん ひきざん",emoji:"🔢",subject:"sansu",time:15,gen:g1calc},
   {id:"g1_word",name:"ぶんしょうだい",emoji:"🧺",subject:"sansu",time:35,count:5,gen:g1word},
   {id:"g1_carry",name:"くりあがり けいさん",emoji:"🔥",subject:"sansu",time:18,gen:g1carry},
   {id:"g1_clock",name:"とけい",emoji:"🕒",subject:"sansu",time:15,gen:g1clock},
   {id:"g1_three",name:"３つの かず",emoji:"🎲",subject:"sansu",time:18,gen:g1three},
];
const G2_STAGES=[
   {id:"g2_kr",name:"かん字 よみ",emoji:"📗",subject:"kokugo",time:15,gen:idx=>kanjiReadMix(KANJI2,JUKUGO2,idx)},
   {id:"g2_kw",name:"かん字 かき",emoji:"🖊️",subject:"kokugo",time:15,gen:idx=>kanjiWriteMix(KANJI2,JUKUGO2,idx)},
   {id:"g2_oppo",name:"はんたい ことば",emoji:"↔️",subject:"kokugo",time:15,gen:opposite},
   {id:"g2_kuku",name:"九九",emoji:"⚡",subject:"sansu",time:12,gen:kuku},
   {id:"g2_word",name:"ぶんしょうだい",emoji:"🛒",subject:"sansu",time:35,count:5,gen:g2word},
   {id:"g2_hissan",name:"ひっさん",emoji:"🧮",subject:"sansu",time:20,gen:hissan},
   {id:"g2_len",name:"ながさ",emoji:"📏",subject:"sansu",time:18,gen:g2len},
   {id:"g2_vol",name:"かさ",emoji:"🧃",subject:"sansu",time:18,gen:g2vol},
   {id:"g2_time",name:"時こくと時間",emoji:"⏰",subject:"sansu",time:20,gen:g2time},
   {id:"g2_num",name:"1000までの かず",emoji:"💯",subject:"sansu",time:18,gen:g2num},
   {id:"g2_frac",name:"ぶんすう",emoji:"🍕",subject:"sansu",time:18,gen:g2frac},
];
const G3_STAGES=[
   {id:"g3_kr",name:"かん字 よみ",emoji:"📘",subject:"kokugo",time:15,gen:()=>kanjiRead(KANJI3)},
   {id:"g3_kw",name:"かん字 かき",emoji:"🖋️",subject:"kokugo",time:15,gen:()=>kanjiWrite(KANJI3)},
   {id:"g3_romaji",name:"ローマ字",emoji:"🔤",subject:"kokugo",time:15,gen:romaji},
   {id:"g3_eigo",name:"えいご",emoji:"🗣️",subject:"eigo",time:15,gen:()=>emojiWord(ENGLISH3,"えいご")},
   {id:"g3_map",name:"地図記号",emoji:"🗺️",subject:"shakai",time:15,gen:mapSym},
   {id:"g3_safety",name:"安全なくらし",emoji:"🚸",subject:"shakai",time:18,gen:()=>qa(SAFETY)},
   {id:"g3_div",name:"わり算",emoji:"➗",subject:"sansu",time:15,gen:g3div},
   {id:"g3_divr",name:"あまりのあるわり算",emoji:"🍰",subject:"sansu",time:20,gen:g3divR},
   {id:"g3_mul",name:"かけ算の筆算",emoji:"🧮",subject:"sansu",time:20,gen:g3mul},
   {id:"g3_word",name:"ぶんしょうだい",emoji:"📝",subject:"sansu",time:35,count:5,gen:g3word},
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
];
const G4_STAGES=[
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
   {id:"g4_word",name:"ぶんしょうだい",emoji:"🧾",subject:"sansu",time:35,count:5,gen:g4word},
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
];
const Q_PER_STAGE=10;
/* ================= 総合問題（各学年ごとの まとめテスト） =================
 * その学年の 全ステージ（全科目・全コンテンツ）から バランスよく14問 ＋ 偉人・名言(IJIN_STAGES)から
 * かならず1問の 計15問(SOUGOU_Q)を出題する。balancedPicks() が 科目→コンテンツの順に ラウンドロビンで
 * えらぶため、毎回 えらばれる単元・問題が かわる。せいかい数に おうじて ゲームチケットを付与
 * （14問以上=2まい、10〜13問=1まい。finishQuiz()を参照）。
 */
const SOUGOU_Q=15;
function balancedPicks(stages,count){ // 科目ごとに束ね、科目→コンテンツの順にラウンドロビンでえらぶ
  const bySubj={};
  stages.forEach(s=>{(bySubj[s.subject]=bySubj[s.subject]||[]).push(s)});
  const subjKeys=shuffle(Object.keys(bySubj));
  const queues=subjKeys.map(k=>shuffle(bySubj[k]));
  const picks=[];let qi=0;
  while(picks.length<count){
    const gi=qi%queues.length;
    if(queues[gi].length===0)queues[gi]=shuffle(bySubj[subjKeys[gi]]);
    picks.push(queues[gi].shift());
    qi++;
  }
  return picks;
}
function makeSougouGen(stages){ // クイズ開始(idx===0)ごとに その回の出題プランを組みなおす
  let plan=null;
  return function(idx,N){
    if(idx===0||!plan||plan.length!==N){
      const regCount=N-1;
      const regPicks=balancedPicks(stages,regCount);
      const ijinSlot=R(N);                     // N問のうち ちょうど1問だけ 偉人・名言にする
      plan=[];let ri=0;
      for(let i=0;i<N;i++)plan.push(i===ijinSlot?{ijin:true}:{stage:regPicks[ri++]});
    }
    const slot=plan[idx];
    return slot.ijin?pick(IJIN_STAGES).gen():slot.stage.gen(R(10),10);
  };
}
const g1SougouStage={id:"g1_sougou",name:"そうごう問題",emoji:"🏆",subject:"sougou",time:30,count:SOUGOU_Q,sougou:true,gen:makeSougouGen(G1_STAGES)};
const g2SougouStage={id:"g2_sougou",name:"そうごう問題",emoji:"🏆",subject:"sougou",time:30,count:SOUGOU_Q,sougou:true,gen:makeSougouGen(G2_STAGES)};
const g3SougouStage={id:"g3_sougou",name:"そうごう問題",emoji:"🏆",subject:"sougou",time:30,count:SOUGOU_Q,sougou:true,gen:makeSougouGen(G3_STAGES)};
const g4SougouStage={id:"g4_sougou",name:"そうごう問題",emoji:"🏆",subject:"sougou",time:30,count:SOUGOU_Q,sougou:true,gen:makeSougouGen(G4_STAGES)};
const GRADES=[
 {id:"g1",label:"１ねんせい",stages:[...G1_STAGES,g1SougouStage]},
 {id:"g2",label:"２ねんせい",stages:[...G2_STAGES,g2SougouStage]},
 {id:"g3",label:"３ねんせい",stages:[...G3_STAGES,g3SougouStage]},
 {id:"g4",label:"４ねんせい",stages:[...G4_STAGES,g4SougouStage]},
];
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
const MAX_TICKETS=5;      // まちがいノートボーナスで ためられる チケットの上限（クイズクリアぶんは 上限なしで必ず発行）
const WRONG_NOTE_GOAL=5;  // まちがいノートの もんだいを これだけ正解すると チケット1まい
let DB=load();
function load(){
  const def={v:2,grade:"g1",stars:{},best:{},stats:{},hist:[],wrong:[],streak:{last:"",n:0},mute:false,
    tickets:0,wrongProg:0,log:[],cleared:{}};
  try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===2)return Object.assign(def,d)}catch(e){}
  return def;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
/* 日付は端末のローカル時刻で判定する（toISOString()はUTCのため、日本では朝9時前に「前日」扱いになり
 * れんぞく日数・きょうの問題数がずれる不具合があった） */
function localDate(t){const d=t?new Date(t):new Date();const p=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function today(){return localDate()}
/* ── まちがいノートの 間隔反復（忘却曲線ベースの 再出題スケジュール） ──
 * まちがえた問題は box:0 で登録し、ふくしゅうで 正解するたびに box を1つ上げて、
 * つぎに出す日(due)を SRS_INTERVALS ぶんだけ 先へずらす（1日→3日→1週間…）。
 * box が SRS_INTERVALS の数を こえたら「おぼえた！」とみなし ノートから そつぎょう(除去)する。
 * その日に due が きた問題を ゆうせんして 出題する（startReview を参照）。 */
const SRS_INTERVALS=[1,3,7];  // box1→1日後, box2→3日後, box3→7日後（その次の正解で そつぎょう）
function addDays(dateStr,n){const[y,mo,d]=String(dateStr).split("-").map(Number);
  const dt=new Date(y,(mo||1)-1,d||1);dt.setDate(dt.getDate()+n);return localDate(dt.getTime());}
function wrongDue(w){return !w.due||w.due<=today();}   // きょう ふくしゅうの じゅんばんが きているか
/* ── ログ（学習の記録を くわしく のこす） ── */
const LOG_MAX=300;         // ためられる ログの けんすう
const DAILY_GOAL=30;       // きょうの もくひょう問題数（ホームの🎯バーに表示。renderHome()を参照）
const SUBJECT_LABEL={kokugo:"こくご",sansu:"さんすう",shakai:"しゃかい",rika:"りか",eigo:"えいご",
  ijin:"偉人・名言",sougou:"そうごう問題",review:"まちがいノート",game:"ゲーム",physics:"ぶつりラボ"};
function addLog(entry){DB.log=DB.log||[];DB.log.unshift(entry);DB.log=DB.log.slice(0,LOG_MAX);}
function fmtDT(ts){const d=new Date(ts);const p=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;}
function bumpStreak(){const t=today();if(DB.streak.last===t)return;
  const y=localDate(Date.now()-864e5);
  DB.streak.n=(DB.streak.last===y)?DB.streak.n+1:1;DB.streak.last=t;}
/* ── ゲームチケット ── */
function grantTickets(n){                                  // n まい発行（上限なし・必ず発行）。0以下なら発行しない
  n=n|0;if(n<=0)return 0;
  DB.tickets=(DB.tickets||0)+n;return n;}
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
/* 結果画面のファンファーレ（★の数に応じて音が増える。beep()がミュートを見るので個別チェック不要） */
const sFanfare=st=>{beep(660,.12);setTimeout(()=>beep(880,.12),130);setTimeout(()=>beep(1320,.3),260);
  if(st>=3)setTimeout(()=>beep(1760,.35),450);};
/* ================= 画面遷移 ================= */
const app=$("#app");
let quiz=null, timerId=null;
function go(screen,arg){stopTimer();
  ({home:renderHome,quiz:startQuiz,result:renderResult,record:renderRecord,
    games:renderGames,review:startReview,physics:renderPhysics,log:renderLog})[screen](arg);
  window.scrollTo(0,0);}
function curGrade(){return GRADES.find(g=>g.id===DB.grade)||GRADES[0]}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
/* {かん字|かんじ} 記法を <ruby> タグに変換（ふりがな表示。データ側は generators.js/data-*.js を参照） */
function furi(s){return esc(s).replace(/\{([^{}|]+)\|([^{}|]+)\}/g,"<ruby>$1<rt>$2</rt></ruby>")}
/* ── かくにんダイアログ（独自モーダル） ──
 * TVブラウザでは confirm() の動作が あてにならない/画面外に出ることがあるため、confirm() は使わず
 * 画面内の 独自モーダルで たずねる。opts:{emoji,title,msg,yes,no,onYes,onNo}
 *  ・「はい(yes)」を押すと onYes() を呼ぶ（cf-yes・赤）
 *  ・「いいえ(no)」/背景タップ/Esc で onNo() を呼んで とじる（cf-no・テーマ色。初期フォーカスは こちら）
 * CSS は css/style.css の .confirm-box を参照。*/
function confirmDialog(opts){
  opts=opts||{};
  const m=document.createElement("div");m.className="modal";
  m.innerHTML=`
  <div class="confirm-box">
    <div class="cf-emoji">${opts.emoji||"❓"}</div>
    <h2>${opts.title||"よろしいですか？"}</h2>
    ${opts.msg?`<p>${opts.msg}</p>`:""}
    <div class="confirm-btns">
      <button class="bigbtn focusable cf-no">${opts.no||"やめる"}</button>
      <button class="bigbtn focusable cf-yes">${opts.yes||"はい"}</button>
    </div>
  </div>`;
  let done=false;
  const cancel=()=>{if(done)return;done=true;document.removeEventListener("keydown",onKey,true);m.remove();opts.onNo&&opts.onNo();};
  const confirm=()=>{if(done)return;done=true;document.removeEventListener("keydown",onKey,true);m.remove();opts.onYes&&opts.onYes();};
  function onKey(e){ if(e.key==="Escape"){e.preventDefault();e.stopPropagation();cancel();} }
  m.querySelector(".cf-no").onclick=cancel;
  m.querySelector(".cf-yes").onclick=confirm;
  m.addEventListener("click",e=>{if(e.target===m)cancel();});   // 背景（モーダルの外側）タップで とじる＝いいえ
  document.addEventListener("keydown",onKey,true);
  document.body.appendChild(m);
  const noBtn=m.querySelector(".cf-no");if(noBtn)noBtn.focus();   // あやまって「はい」を押しにくいよう 安全側へ初期フォーカス
  return m;
}
/* ── ホーム ── */
function renderHome(){
  document.body.dataset.grade=DB.grade;
  const g=curGrade();
  let tot=0,cor=0,starSum=0;const todayHist=DB.hist.filter(h=>h.d===today());
  const todayN=todayHist.reduce((a,h)=>a+h.n,0);
  const dueCount=DB.wrong.filter(wrongDue).length;   // きょう ふくしゅうの じゅんばんが きた もんだいの数
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
      <div class="dstat"><b>${todayN}</b><small>きょうの問題</small></div>
    </div>
  </div>
  <div class="goal-card">
    <div class="goal-tx">🎯 きょうの もくひょう <b>${todayN} / ${DAILY_GOAL}もん</b>${todayN>=DAILY_GOAL?"　🎉 たっせい！":""}</div>
    <div class="bar-bg"><div class="bar-fg" style="width:${Math.min(100,Math.round(todayN/DAILY_GOAL*100))}%"></div></div>
  </div>
  ${DB.wrong.length?`
  <button class="review-card focusable" data-act="review">
    <span class="em">📓</span>
    <span class="tx"><b>まちがいノート</b>
      <small>${dueCount>0
        ?`きょう ふくしゅうする もんだい ${dueCount}こ（ぜんぶで ${DB.wrong.length}こ）。${WRONG_NOTE_GOAL}問 正解で 🎟️チケット！`
        :`きょうの ふくしゅうは かんぺき！ ためた もんだいは ${DB.wrong.length}こ（また あとで 出るよ）`}</small></span>
    <span class="go">ふくしゅう →</span>
  </button>`:`
  <div class="review-card done">
    <span class="em">✅</span>
    <span class="tx"><b>まちがいノート</b>
      <small>いまは まちがいが ないよ！この ちょうしで がんばろう！</small></span>
  </div>`}
  ${secRow("sougou","🏆 そうごう問題","var(--sougou)")}
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
  </div>
  <div class="rowbtns">
    <button class="bigbtn focusable" data-act="log">🧾 ログを みる</button>
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
  // きょう due が きた問題を ゆうせん（シャッフル）。足りなければ due が近い順で 補充する
  const due=shuffle(DB.wrong.filter(wrongDue));
  const notDue=DB.wrong.filter(w=>!wrongDue(w)).sort((a,b)=>(a.due<b.due?-1:a.due>b.due?1:0));
  const items=due.concat(notDue).slice(0,Q_PER_STAGE);
  const stage={id:"review",name:"まちがいノート",emoji:"📓",time:20,review:true};
  quiz={stage,qs:items.map(w=>w.q),i:0,cor:0,score:0,t0:Date.now(),wrongList:[],reviewSrc:items};
  renderQ();
}
function renderQ(){
  const {stage,qs,i}=quiz;const q=qs[i];
  app.innerHTML=`
  <div class="quiz-top">
    <button class="back focusable" data-act="quitquiz" style="margin:0">← やめる</button>
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
  // まちがえたときは 正解（緑わく）を ながめる時間を ながくとる（学習効果のため）
  setTimeout(()=>{fb.remove();
    quiz.i++;
    if(quiz.i<quiz.qs.length)renderQ();else finishQuiz();},ok?900:1600);}
function finishQuiz(){
  const {stage,qs,cor,score,wrongList}=quiz;
  const acc=Math.round(cor/qs.length*100);
  const stars=acc>=90?3:acc>=70?2:acc>=50?1:0;
  bumpStreak();
  let ticketEarned=0;
  if(stage.review){ // まちがいノート(間隔反復): 正解=box↑&次回を先へ / 不正解=box0にもどす / そつぎょうは除去
    const t=today();
    const wrongKeys=new Set(wrongList.map(w=>w.q.q+(w.q.big||"")));
    let solvedCount=0;
    (quiz.reviewSrc||[]).forEach(item=>{
      const key=item.q.q+(item.q.big||"");
      const w=DB.wrong.find(x=>(x.q.q+(x.q.big||""))===key);
      if(!w)return;
      if(wrongKeys.has(key)){ w.box=0; w.due=t; }        // まちがえた → さいしょの箱へ もどす
      else{                                               // せいかい → つぎの箱へ（間隔をのばす）
        solvedCount++; w.box=(w.box|0)+1;
        w.due=(w.box>SRS_INTERVALS.length)?t:addDays(t,SRS_INTERVALS[w.box-1]);
      }
    });
    DB.wrong=DB.wrong.filter(w=>(w.box|0)<=SRS_INTERVALS.length); // box が 上限をこえたら そつぎょう(除去)
    ticketEarned=grantWrongNoteTickets(solvedCount);
  }else if(stage.sougou){ // 総合問題: せいかい数に おうじて チケットを付与（14問以上=2まい、10〜13問=1まい）
    const prevBest=DB.best[stage.id]||0;
    DB.stars[stage.id]=Math.max(DB.stars[stage.id]||0,stars);
    DB.best[stage.id]=Math.max(prevBest,score);
    const st=DB.stats[stage.id]||{c:0,t:0};st.c+=cor;st.t+=qs.length;DB.stats[stage.id]=st;
    ticketEarned=grantTickets(cor>=14?2:cor>=10?1:0);
    if(ticketEarned>0){DB.cleared=DB.cleared||{};DB.cleared[stage.id]=true}
  }else{
    const prevBest=DB.best[stage.id]||0;
    const isFirstClear=!(DB.cleared&&DB.cleared[stage.id]);     // このステージで まだ一度も チケットを もらっていない
    const isNewRecord=score>=prevBest;                          // 自己ベスト タイ or 更新
    const isHighAcc=acc>=90;                                    // せいかい率 9割いじょう（満点ふくむ）
    // 初回クリアは 半分(50%)以上正解、2回目いこうは 自己ベスト更新 か 9割いじょうなら 何度でもOK
    const qualifies=isFirstClear?acc>=50:(isNewRecord||isHighAcc);
    DB.stars[stage.id]=Math.max(DB.stars[stage.id]||0,stars);
    DB.best[stage.id]=Math.max(prevBest,score);
    const st=DB.stats[stage.id]||{c:0,t:0};st.c+=cor;st.t+=qs.length;DB.stats[stage.id]=st;
    // まちがい10以上は付与停止(ノート優先)。ただし9割いじょう(満点ふくむ)は 何度でも必ず発行
    const wrongGateActive=DB.wrong.length>=10&&!isHighAcc;
    // 条件を みたせば 必ず チケットを1まい発行
    ticketEarned=grantTickets(qualifies&&!wrongGateActive?1:0);
    if(ticketEarned>0){DB.cleared=DB.cleared||{};DB.cleared[stage.id]=true}
    quiz.isFirstClear=isFirstClear;quiz.isNewRecord=isNewRecord;quiz.isHighAcc=isHighAcc;quiz.prevBest=prevBest;
    quiz.wrongGateActive=wrongGateActive;
  }
  wrongList.forEach(w=>{if(DB.wrong.length<60&&!DB.wrong.find(x=>x.q.q===w.q.q&&x.q.big===w.q.big))
    DB.wrong.push({q:w.q,stageId:w.stageId,box:0,due:today()})});  // 新しいまちがいは box:0・きょうから ふくしゅう対象
  DB.hist.unshift({d:today(),g:DB.grade,s:stage.name,acc,score,n:qs.length});
  DB.hist=DB.hist.slice(0,100);
  const logSubject=stage.review?"review":stage.subject;
  addLog({ts:new Date().toISOString(),grade:DB.grade,gradeLabel:curGrade().label,
    subject:logSubject,subjectLabel:SUBJECT_LABEL[logSubject]||logSubject,
    unit:stage.name,emoji:stage.emoji,
    score,acc,cor,total:qs.length,stars:stage.review?null:stars,
    ticket:ticketEarned,ticketBalance:DB.tickets||0});
  save();
  renderResult({stage,acc,cor,total:qs.length,score,stars,time:Math.round((Date.now()-quiz.t0)/1000),
    wrongs:wrongList,ticketEarned,tickets:DB.tickets||0,
    isFirstClear:quiz.isFirstClear,isNewRecord:quiz.isNewRecord,isHighAcc:quiz.isHighAcc,prevBest:quiz.prevBest||0,
    wrongGateActive:quiz.wrongGateActive||false});
}
function renderResult(r){
  const msg=r.acc>=90?"すごい！パーフェクトきゅう！":r.acc>=70?"よくできました！":r.acc>=50?"がんばったね！":"もういちど ちょうせんしよう！";
  if(r.stars>=1)sFanfare(r.stars);
  let tk="";
  if(r.stage.review){
    if(r.ticketEarned>0){
      tk=`<div class="tk-box tk-got">🎟️ まちがいノートを がんばったので ゲームチケットを ゲット！
        <small>もっている チケット：${r.tickets}まい</small></div>`;
    }else{
      tk=`<div class="tk-box">🎟️ こんかいは チケットは もらえなかったよ
        <small>まちがえた 問題を ${WRONG_NOTE_GOAL}問 正解すると ゲームチケットが もらえるよ</small></div>`;
    }
  }else if(r.stage.sougou){
    if(r.ticketEarned>0){
      const badge=r.ticketEarned>=2?"🏆 だいせいこう！":"🌟 よくがんばった！";
      tk=`<div class="tk-box tk-got">
        <div class="tk-badge">${badge}</div>
        🎟️ ゲームチケットを ${r.ticketEarned}まい ゲット！
        <small>もっている チケット：${r.tickets}まい</small></div>`;
    }else{
      tk=`<div class="tk-box">🎟️ こんかいは チケットは もらえなかったよ
        <small>15問中 10問いじょう正解で🎟️1まい、14問いじょう正解で🎟️2まい もらえるよ</small></div>`;
    }
  }else{
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
    ${r.wrongs&&r.wrongs.length?`
    <div class="res-wrong">
      <div class="rw-title">📖 まちがえた もんだいの こたえ</div>
      ${r.wrongs.map(w=>`<div class="rw-item">
        <div class="rw-q">${furi(w.q.q).replace(/\n/g,"　")}${w.q.big?` <b>${furi(w.q.big)}</b>`:""}</div>
        <div class="rw-a">こたえ → <b>${furi(w.q.choices[w.q.answer])}</b></div></div>`).join("")}
    </div>`:""}
    <div class="rowbtns">
      <button class="bigbtn focusable" data-act="retry">🔁 もういちど</button>
      <button class="bigbtn focusable" data-act="home">🏠 ホーム</button>
    </div>
  </div>`;
  window._lastStage=r.stage;
}
/* ── きろく ── */
function recRow(s){ // 1ステージぶんの正答率バー（学年カード・偉人カード共通）
  const st=DB.stats[s.id];const acc=st&&st.t?Math.round(st.c/st.t*100):null;
  return `<div class="rec-row"><span class="nm">${s.emoji} ${s.name}</span>
    <div class="bar-bg"><div class="bar-fg" style="width:${acc||0}%"></div></div>
    <span class="pc">${acc===null?"ー":acc+"%"}</span></div>`;}
function renderRecord(){
  const rows=GRADES.map(g=>
    `<div class="rec-card"><div style="font-weight:800;margin-bottom:.4rem">${g.label}</div>${g.stages.map(recRow).join("")}</div>`
  ).join("");
  const ijinCard=`<div class="rec-card"><div style="font-weight:800;margin-bottom:.4rem">偉人・名言</div>${IJIN_STAGES.map(recRow).join("")}</div>`;
  const hist=DB.hist.slice(0,15).map(h=>
    `<div class="hist">${h.d}　${h.s}　${h.acc}%　${h.score}点</div>`).join("")||`<div class="empty">まだ きろくが ないよ</div>`;
  app.innerHTML=`
  <button class="back focusable" data-act="home">← もどる</button>
  <div class="pagetitle">📊 きろく</div>
  ${rows}
  ${ijinCard}
  <div class="rec-card"><div style="font-weight:800;margin-bottom:.4rem">さいきんの きろく</div>${hist}</div>`;
}
/* ── ログ（日時・学年・科目・単元・点数・☆・チケットの くわしい 一覧） ── */
function renderLog(){
  const rows=(DB.log||[]).map(l=>{
    const scoreTx=l.score==null?"ー":
      `${l.score}点${l.total?`（${l.cor}/${l.total}問 ${l.acc}%）`:""}`;
    const starTx=l.stars==null?"ー":"⭐".repeat(l.stars)+"☆".repeat(3-l.stars);
    const tkTx=l.ticket?`${l.ticket>0?"+":""}${l.ticket}まい → ${l.ticketBalance}まい`:`${l.ticketBalance}まい`;
    return `<div class="log-row ${l.subject}">
      <div class="log-top">
        <span class="log-dt">${fmtDT(l.ts)}</span>
        <span class="log-chip">${esc(l.gradeLabel||"")}</span>
        <span class="log-chip">${esc(l.subjectLabel)}</span>
      </div>
      <div class="log-main">${l.emoji||""} ${esc(l.unit)}</div>
      <div class="log-stats">
        <span>📊 ${scoreTx}</span>
        <span>⭐ ${starTx}</span>
        <span>🎟️ ${tkTx}</span>
      </div>
    </div>`;}).join("")||`<div class="empty">まだ ログが ないよ</div>`;
  app.innerHTML=`
  <button class="back focusable" data-act="home">← もどる</button>
  <div class="pagetitle">🧾 ログ</div>
  <div class="rec-card">${rows}</div>`;
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
    <small>チケットを つかうと あそべるよ（ゲームによって ひつような まいすうが ちがうよ）</small></div>
  <div class="grid">
    ${extras}
  </div>
  <div class="game-hint">タップ / スペース / 決定ボタンで あそべるよ！</div>`;
}
/* ── 外部ゲーム(iframe): チケット1まい=1プレイ（ゲーム内の3つの命を つかいきった「本当の」ゲームオーバーで おしまい。画面枠ハートは廃止） ── */
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
  DB.tickets-=cost;                      // チケットを cost まい消費（開始時に消費）
  addLog({ts:new Date().toISOString(),grade:DB.grade,gradeLabel:curGrade().label,
    subject:"game",subjectLabel:SUBJECT_LABEL.game,unit:g.title,emoji:g.emoji,
    score:null,acc:null,cor:null,total:null,stars:null,
    ticket:-cost,ticketBalance:DB.tickets||0});
  save();
  const m=document.createElement("div");m.className="modal";
  m.innerHTML=`
  <div class="stage">
    <iframe src="${g.src}"></iframe>
    <div class="ext-over hidden">
      <div style="font-size:2.6rem">🎮</div>
      <h2>おしまい！</h2>
      <div>また クイズで チケットを あつめてね</div>
      <button class="bigbtn focusable ext-over-close">🎮 ゲームひろば</button>
    </div>
  </div>
  <button class="close focusable">✕</button>`;
  const overEl=m.querySelector(".ext-over");
  const iframeEl=m.querySelector("iframe");
  // ゲーム側へ 親アプリの おと設定(DB.mute)を わたし、おとの ON/OFF を 一致させる（postMessage）
  function sendInit(){try{iframeEl.contentWindow.postMessage({type:"BQ_INIT",mute:!!DB.mute},"*");}catch(e){}}
  iframeEl.addEventListener("load",sendInit);      // iframe 読込後に 初期設定を おくる
  function onMsg(e){
    if(e.source!==iframeEl.contentWindow)return;    // このiframe以外からの通知は無視
    if(!e.data)return;
    if(e.data.type==="BQ_READY"){sendInit();return;}// ゲーム側から 要求が来たら 初期設定を かえす（読込タイミングの取りこぼしぼうし）
    if(e.data.type!=="BQ_GAME_OVER")return;
    // ゲーム内の 3つの命を つかいきった「本当の」ゲームオーバー → この回で おしまい（画面枠ハートは廃止したので すぐ終了）
    overEl.classList.remove("hidden");
    iframeEl.style.pointerEvents="none";            // これ以上あそべないようにする
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
 {title:"みずめんの はもん", emoji:"💧", tag:"かんしょう", src:"physics/interference.html"},
 {title:"おとが つくる もよう", emoji:"🔔", tag:"きょうめい", src:"physics/chladni.html"},
 {title:"きの そだちかた", emoji:"🌿", tag:"ぶんき", src:"physics/lsystem.html"},
 {title:"むげんに つづく もよう", emoji:"🔮", tag:"フラクタル", src:"physics/fractal.html"},
 {title:"つなみと じめんの かたち", emoji:"🌊", tag:"あさせ", src:"physics/shallowwater.html"},
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
  addLog({ts:new Date().toISOString(),grade:DB.grade,gradeLabel:curGrade().label,
    subject:"physics",subjectLabel:SUBJECT_LABEL.physics,unit:p.title,emoji:p.emoji,
    score:null,acc:null,cor:null,total:null,stars:null,
    ticket:0,ticketBalance:DB.tickets||0});
  save();
  const m=document.createElement("div");m.className="modal";
  m.innerHTML=`
  <div class="stage">
    <iframe src="${p.src}"></iframe>
  </div>
  <button class="close focusable">✕</button>`;
  m.querySelector(".close").onclick=()=>m.remove();
  document.body.appendChild(m);}
/* ================= イベント委譲 ================= */
app.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.dataset.act;
  if(act==="grade"){DB.grade=b.dataset.id;save();renderHome();}
  else if(act==="stage"){const s=curGrade().stages.find(x=>x.id===b.dataset.id)
    ||GRADES.flatMap(g=>g.stages).find(x=>x.id===b.dataset.id);if(s)go("quiz",s);}
  else if(act==="specialstage"){const s=IJIN_STAGES.find(x=>x.id===b.dataset.id);if(s)go("quiz",s);}
  else if(act==="ans")answer(+b.dataset.i);
  // クイズ中の「← やめる」: とちゅうで やめると この回は きろくに のこらない → 誤タップぼうしに かくにん
  else if(act==="quitquiz"){
    stopTimer();                                   // ダイアログ表示中は タイマーを止める（時間切れで裏の画面が進まないように）
    const reviewing=quiz&&quiz.stage&&quiz.stage.review;
    confirmDialog({emoji:"🚪",title:reviewing?"ふくしゅうを やめる？":"クイズを やめる？",
      msg:"いま やめると、この かいの きろくは のこらないよ。",
      yes:"やめる",no:"つづける",
      onYes:()=>go("home"),
      onNo:()=>{ if(quiz&&quiz.stage)startTimer(quiz.stage.time); }});  // つづけるなら タイマー再開（のこり時間は満タンに）
  }
  else if(act==="home")go("home");
  // まちがいノートのステージは gen を持たないため、通常クイズとして再開するとクラッシュする → review画面へ
  else if(act==="retry"){const s=window._lastStage;if(s&&s.review)go("review");else if(s)go("quiz",s);}
  else if(act==="record")go("record");
  else if(act==="log")go("log");
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
  // モーダル（かくにんダイアログ・チケット不足・ゲームオーバー等）が 開いていたら、その中だけを
  // ナビの対象にする（うしろの画面の ボタンに フォーカスが にげないように）
  const modals=document.querySelectorAll(".modal");
  const scope=modals.length?modals[modals.length-1]:document;
  const els=[...scope.querySelectorAll(".focusable:not(:disabled)")];
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
