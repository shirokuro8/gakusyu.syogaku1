"use strict";
/* ================= util ================= */
const $=s=>document.querySelector(s);
const R=n=>Math.floor(Math.random()*n);
const pick=a=>a[R(a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
function mk(q,correct,wrongs,big){ // 選択肢組立て（重複除去・数値は不足分を自動補充）
  const ws=[...new Set(wrongs.map(String).filter(w=>w!==String(correct)))].slice(0,3);
  const n=Number(correct);let g=0;
  while(ws.length<3&&!isNaN(n)&&g++<60){
    const w=String(n+(R(9)+1)*(R(2)?1:-1));
    if(Number(w)>=0&&w!==String(correct)&&!ws.includes(w))ws.push(w);}
  const cs=shuffle([String(correct),...ws]);
  return {q,choices:cs,answer:cs.indexOf(String(correct)),big};
}
function numWrongs(ans,spread=3){const s=new Set();let g=0;
  while(s.size<3&&g++<60){const d=(R(spread)+1)*(R(2)?1:-1);const w=ans+d;if(w>=0&&w!==ans)s.add(w)}
  return [...s];}
/* ================= 出題ロジック（国語：kanjiRead/kanjiWrite等は data-kanji.js のプールを受け取る） ================= */
function kanjiRead(pool){const[k,y]=pick(pool);
  return mk(`この かんじの よみかたは？`,y,shuffle([...new Set(pool.map(p=>p[1]))].filter(r=>r!==y)).slice(0,3),k);}
function kanjiWrite(pool){const[k,y]=pick(pool);
  // 誤答は「読みが違う」語から選ぶ（同じ読みの別の字＝もう一つの正解を誤答にしてしまう事故を防ぐ）
  return mk(`「${y}」を かんじで かくと？`,k,shuffle(pool.filter(p=>p[1]!==y)).slice(0,3).map(p=>p[0]));}
/* 「かん字 よみ／かき」用：熟語プールと単漢字プールから 前半5問=熟語・後半5問=単漢字 で出題する */
function kanjiReadMix(kanjiPool,jukugoPool,idx){return kanjiRead(idx<5?jukugoPool:kanjiPool);}
function kanjiWriteMix(kanjiPool,jukugoPool,idx){return kanjiWrite(idx<5?jukugoPool:kanjiPool);}
function emojiWord(pool,label){const[e,w]=pick(pool);
  return mk(`この えを ${label}で かくと？`,w,shuffle(pool.filter(p=>p[1]!==w)).slice(0,3).map(p=>p[1]),e);}
function opposite(){const[a,b]=pick(OPPO);const[q,ans]=R(2)?[a,b]:[b,a];
  return mk(`「${q}」の はんたいの ことばは？`,ans,shuffle(OPPO.flat().filter(w=>w!==ans&&w!==q)).slice(0,3));}
function romaji(){const t=R(2);const[h,r]=pick(ROMAJI);
  if(t===0)return mk(`「${h}」を ローマ字で かくと？`,r,shuffle(ROMAJI.filter(p=>p[1]!==r)).slice(0,3).map(p=>p[1]));
  return mk(`ローマ字「${r}」を ひらがなで かくと？`,h,shuffle(ROMAJI.filter(p=>p[0]!==h)).slice(0,3).map(p=>p[0]));}
function idiom(){const[k,m]=pick(IDIOM4);
  return mk(`「${k}」の いみは？`,m,shuffle(IDIOM4.filter(p=>p[1]!==m)).slice(0,3).map(p=>p[1]));}
/* ── 手続き生成（算数） ── */
function g1calc(){if(R(2)){const a=R(9)+1,b=R(10-a)+0;return mk(`${a} ＋ ${b} ＝ ？`,a+b,numWrongs(a+b))}
  const a=R(9)+2,b=R(a-1)+1;return mk(`${a} － ${b} ＝ ？`,a-b,numWrongs(a-b));}
function g1carry(){if(R(2)){let a=R(6)+4,b=R(6)+4;if(a+b<11)b=11-a+R(4);return mk(`${a} ＋ ${b} ＝ ？`,a+b,numWrongs(a+b))}
  const ans=R(8)+2,b=R(6)+4,a=ans+b;return mk(`${a} － ${b} ＝ ？`,ans,numWrongs(ans));}
function g1three(){const t=R(3);let a,b,c,ans,op;
  if(t===0){a=R(4)+1;b=R(4)+1;c=R(4)+1;ans=a+b+c;op=`${a} ＋ ${b} ＋ ${c}`}
  else if(t===1){a=R(5)+5;b=R(3)+1;c=R(3)+1;ans=a-b-c;op=`${a} － ${b} － ${c}`}
  else{a=R(5)+3;b=R(4)+1;c=R(4)+1;ans=a+b-c;op=`${a} ＋ ${b} － ${c}`}
  return mk(`${op} ＝ ？`,ans,numWrongs(ans));}
/* ── 小1 文章題（えらぶ答えに「しき」も表示） ── */
function g1word(){
  const T=[["🍎","りんご","こ"],["🍊","みかん","こ"],["🐟","おさかな","ひき"],
    ["🐶","いぬ","ひき"],["🚗","くるま","だい"],["🍪","クッキー","まい"],
    ["🎈","ふうせん","こ"],["⭐","ほし","こ"],["🍩","ドーナツ","こ"],["🐤","ひよこ","わ"]];
  const [em,nm,c]=pick(T);
  if(R(2)===0){ // たしざん
    const a=R(4)+2, b=R(4)+1, ans=a+b;                 // a:2..5 b:1..4 ans<=9
    const [v,tot]=pick([["もらいました","ぜんぶで"],["ふえました","あわせて"],["きました","ぜんぶで"]]);
    const q=`${em} ${nm}が ${a}${c} あります。\nあとで ${b}${c} ${v}。\n${tot} なん${c}に なりますか？`;
    const sub=a>=b?`${a} － ${b} ＝ ${a-b}`:`${b} － ${a} ＝ ${b-a}`;
    return mk(q,`${a} ＋ ${b} ＝ ${ans}`,[sub,`${a} ＋ ${b} ＝ ${ans+1}`,`${a} ＋ ${b+1} ＝ ${a+b+1}`]);
  }
  const a=R(4)+4, b=R(a-2)+1, ans=a-b;                  // a:4..7 b:1..a-2 ans>=2
  const [v,tot]=pick([["たべました","のこりは"],["あげました","のこりは"],["つかいました","のこりは"]]);
  const q=`${em} ${nm}が ${a}${c} あります。\n${b}${c} ${v}。\n${tot} なん${c} ですか？`;
  return mk(q,`${a} － ${b} ＝ ${ans}`,[`${a} ＋ ${b} ＝ ${a+b}`,`${a} － ${b} ＝ ${ans+1}`,`${a} － ${b} ＝ ${ans-1}`]);
}
const CLK=["🕛","🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚"];
const CLKH=["🕧","🕜","🕝","🕞","🕟","🕠","🕡","🕢","🕣","🕤","🕥","🕦"];
function g1clock(){const h=R(12);const half=R(2);
  const e=half?CLKH[h]:CLK[h];const hh=h===0?12:h;
  const ans=half?`${hh}じはん`:`${hh}じ`;
  const ws=[];while(ws.length<3){const w=R(12)+1;const s=half&&R(2)?`${w}じ`:half?`${w}じはん`:R(2)?`${w}じはん`:`${w}じ`;if(s!==ans&&!ws.includes(s))ws.push(s)}
  return mk(`この とけいは なんじ？`,ans,ws,e);}
function kuku(){const a=R(9)+1,b=R(9)+1,ans=a*b;
  return mk(`${a} × ${b} ＝ ？`,ans,[ans+a,ans-a,ans+b,ans-b,ans+1].filter(v=>v>0&&v!==ans));}
function hissan(){if(R(2)){const a=R(80)+10,b=R(90-Math.floor(a/2))+10,ans=a+b;
    return mk(`ひっさんで けいさん\n${a} ＋ ${b} ＝ ？`,ans,numWrongs(ans,10))}
  const b=R(50)+10,ans=R(50)+5,a=b+ans;
  return mk(`ひっさんで けいさん\n${a} － ${b} ＝ ？`,ans,numWrongs(ans,10));}
function g2len(){const t=R(3);
  if(t===0){const c=R(9)+1;return mk(`${c}cm ＝ なんmm？`,`${c*10}mm`,[`${c}mm`,`${c*100}mm`,`${c*10+5}mm`])}
  if(t===1){const m=R(5)+1;return mk(`${m}m ＝ なんcm？`,`${m*100}cm`,[`${m*10}cm`,`${m*1000}cm`,`${m*100+10}cm`])}
  const c=R(8)+1,m=R(8)+1;return mk(`${c}cm${m}mm ＝ なんmm？`,`${c*10+m}mm`,[`${c+m}mm`,`${c*10+m+10}mm`,`${c*100+m}mm`]);}
function g2vol(){const t=R(3);
  if(t===0){const l=R(5)+1;return mk(`${l}L ＝ なんdL？`,`${l*10}dL`,[`${l}dL`,`${l*100}dL`,`${l*10+5}dL`])}
  if(t===1){const l=R(3)+1;return mk(`${l}L ＝ なんmL？`,`${l*1000}mL`,[`${l*100}mL`,`${l*10}mL`,`${l*1000+100}mL`])}
  const d=R(9)+1;return mk(`${d}dL ＝ なんmL？`,`${d*100}mL`,[`${d*10}mL`,`${d*1000}mL`,`${d*100+50}mL`]);}
function g2time(){const t=R(3);
  if(t===0){const h=R(11)+1,m=pick([15,30,45]);
    return mk(`${h}じから ${m}ぷんあとは？`,`${h}じ${m}ぷん`,
      [`${h%12+1}じ${m}ぷん`,`${h}じ${m===15?30:m-15}ぷん`,`${h%12+1}じ`])}
  if(t===1){const a=R(9)+1,d=R(3)+1;return mk(`${a}じから ${a+d}じまで なんじかん？`,`${d}じかん`,[`${d+1}じかん`,`${d-1<=0?d+2:d-1}じかん`,`${d+3}じかん`])}
  const m=pick([30,40,50]);const h=R(10)+1;
  return mk(`${h}じ${m}ぷんの ${60-m}ぷんあとは？`,`${h+1}じ`,[`${h}じ`,`${h+2}じ`,`${h+1}じ${30}ぷん`]);}
function g2num(){const t=R(3);
  if(t===0){const h=R(9)+1,te=R(10),o=R(10);const n=h*100+te*10+o;
    return mk(`100が${h}こ、10が${te}こ、1が${o}こで いくつ？`,n,numWrongs(n,50))}
  if(t===1){const n=R(900)+100;const ans=Math.floor(n/10)%10;
    const ws=shuffle([0,1,2,3,4,5,6,7,8,9].filter(v=>v!==ans)).slice(0,3);
    return mk(`${n} の 十のくらいの かずは？`,ans,ws)}
  const a=R(900)+100,b=R(900)+100;if(a===b)return g2num();
  return mk(`大きいのは どっち？ ${a} と ${b}`,Math.max(a,b),[Math.min(a,b),Math.max(a,b)+100,Math.min(a,b)-50].filter(v=>v>0));}
function g2frac(){const t=R(2);
  if(t===0){const n=pick([8,12,16]);return mk(`${n}この はんぶん（２ぶんの１）は なんこ？`,n/2,numWrongs(n/2))}
  const n=pick([8,12,16]);return mk(`${n}この ４ぶんの１は なんこ？`,n/4,numWrongs(n/4));}
/* ── 3年生：社会 ── */
function mapSym(){const[e,w]=pick(MAPSYM);
  return mk(`この たてものを 地図で あらわすと？`,w,shuffle(MAPSYM.filter(p=>p[1]!==w)).slice(0,3).map(p=>p[1]),e);}
function qa(pool){const it=pick(pool);return mk(it.q,it.a,it.w);}
/* ── 3年生：算数 ── */
function g3div(){const b=R(8)+2,c=R(8)+2,a=b*c;return mk(`${a} ÷ ${b} ＝ ？`,c,numWrongs(c));}
function g3divR(){const b=R(7)+2,q=R(7)+1,r=R(b-1)+1,a=b*q+r;
  const r2=r+1<b?r+1:r-1;
  return mk(`${a} ÷ ${b} ＝ ？`,`${q}あまり${r}`,
    [`${q}あまり${r2}`,`${q+1}あまり${r}`,`${q-1>0?q-1:q+2}あまり${r}`]);}
function g3mul(){const a=R(89)+11,b=R(8)+2;return mk(`${a} × ${b} ＝ ？`,a*b,numWrongs(a*b,Math.max(6,a)));}
function g3bignum(){const t=R(3);
  if(t===0){const m=R(9)+1;return mk(`${m}万は 千を なんこ あつめた かず？`,m*10,numWrongs(m*10,8));}
  if(t===1){const n=R(9000)+1000;const d=Math.floor(n/100)%10;
    return mk(`${n} の 百のくらいの すう字は？`,d,shuffle([0,1,2,3,4,5,6,7,8,9].filter(v=>v!==d)).slice(0,3));}
  let a=R(90000)+10000,b=R(90000)+10000;if(a===b)b+=7;const mx=Math.max(a,b);
  return mk(`大きいのは どっち？\n${a} と ${b}`,mx,[Math.min(a,b),mx+10000,mx-1000]);}
function g3time(){const t=R(3);
  if(t===0){const m=R(4)+1;return mk(`${m}分は なん秒？`,m*60,numWrongs(m*60,20));}
  if(t===1){const s=pick([70,80,90,100,110,130,150]),mm=Math.floor(s/60),ss=s%60;
    return mk(`${s}秒は なん分なん秒？`,`${mm}分${ss}秒`,[`${mm}分${ss+10}秒`,`${mm+1}分${ss}秒`,`${mm}分${ss-10}秒`]);}
  const h=R(2)+1;return mk(`${h}時間は なん分？`,h*60,numWrongs(h*60,15));}
function g3decimal(){const t=R(3);
  if(t===0){const n=R(9)+1;const ans=(n/10).toFixed(1);
    const ws=new Set();while(ws.size<3){const w=((R(9)+1)/10).toFixed(1);if(w!==ans)ws.add(w);}
    return mk(`0.1が ${n}こ あつまると いくつ？`,ans,[...ws]);}
  if(t===1){const x=R(6)+1,y=R(6)+1;const ans=((x+y)/10).toFixed(1);
    const ws=new Set();let g=0;while(ws.size<3&&g++<40){const w=(((x+y)+(R(4)+1)*(R(2)?1:-1))/10).toFixed(1);if(w!==ans&&Number(w)>=0)ws.add(w);}
    return mk(`0.${x} ＋ 0.${y} ＝ ？`,ans,[...ws]);}
  const x=R(9)+1,y=R(9)+1;if(x===y)return g3decimal();
  const big=Math.max(x,y),small=Math.min(x,y);
  // 誤答も小数でそろえる（以前は mk() の自動補充で「5.8」のような不自然な整数まじりの選択肢が出ていた）
  return mk(`0.${x} と 0.${y}、大きいのは？`,(big/10).toFixed(1),
    [(small/10).toFixed(1),(big/10+1).toFixed(1),(small/10+1).toFixed(1)]);}
function g3frac(){if(R(2)){const d=pick([3,5,6]);const k=pick([2,3,4]);const n=d*k;
    return mk(`${n}この ${d}分の1は なんこ？`,n/d,numWrongs(n/d));}
  const d=pick([4,5,6]);const a=R(d-2)+1;const b=R(d-a-1)+1;const ans=a+b;
  return mk(`${d}分の${a} ＋ ${d}分の${b} ＝ ？`,`${d}分の${ans}`,[`${d}分の${ans+1}`,`${d}分の${Math.max(1,ans-1)}`,`${d+1}分の${ans}`]);}
function g3lenweight(){const t=R(3);
  if(t===0){const km=R(5)+1;return mk(`${km}km ＝ なんm？`,`${km*1000}m`,[`${km*100}m`,`${km*10}m`,`${km*1000+100}m`]);}
  if(t===1){const kg=R(5)+1;return mk(`${kg}kg ＝ なんg？`,`${kg*1000}g`,[`${kg*100}g`,`${kg*10}g`,`${kg*1000+100}g`]);}
  const m=R(4)+1,cm=R(90)+10;return mk(`${m}m${cm}cm ＝ なんcm？`,`${m*100+cm}cm`,[`${m+cm}cm`,`${m*100+cm+10}cm`,`${m*10+cm}cm`]);}
function g3shape(){if(R(2)){if(R(2)){const r=R(9)+1,d=r*2;
    const ws=[...new Set([r,d+2,d+4,d-2].filter(v=>v>0&&v!==d))].slice(0,3).map(v=>`${v}cm`);
    return mk(`半径${r}cmの 円の 直径は？`,`${d}cm`,ws);}
    const d=(R(9)+1)*2,r=d/2;
    const ws=[...new Set([d,r+2,r+3,r+4].filter(v=>v>0&&v!==r))].slice(0,3).map(v=>`${v}cm`);
    return mk(`直径${d}cmの 円の 半径は？`,`${r}cm`,ws);}
  return qa(TRIANGLE);}
/* ── 4年生：算数 ── */
function g4bignum(){const t=R(3);
  if(t===0){const o=R(9)+1;return mk(`${o}億は 千万を なんこ あつめた かず？`,o*10,numWrongs(o*10,8));}
  if(t===1){const c=R(9)+1;return mk(`${c}兆は 千億を なんこ あつめた かず？`,c*10,numWrongs(c*10,8));}
  const n=R(9)+1;return mk(`${n}万を 100ばい すると？`,`${n*100}万`,[`${n*10}万`,`${n*1000}万`,`${n}億`]);}
function g4div2(){const b=R(19)+11,q=R(8)+2,a=b*q;return mk(`${a} ÷ ${b} ＝ ？`,q,numWrongs(q));}
function g4round(){const t=R(2);
  if(t===0){const n=R(9000)+1000,r=Math.round(n/100)*100;
    return mk(`${n} を 百のくらいで 四捨五入すると？`,r,[r+100,r-100,Math.floor(n/100)*100]);}
  const n=R(90000)+10000,r=Math.round(n/1000)*1000;
  return mk(`${n} を 千のくらいで 四捨五入すると？`,r,[r+1000,r-1000,Math.floor(n/1000)*1000]);}
function g4angle(){const t=R(4);
  if(t===0)return mk(`直角は なん度？`,90,[45,60,120,180]);
  if(t===1)return mk(`一直線（半回転）は なん度？`,180,[90,270,360,120]);
  if(t===2)return mk(`1回転は なん度？`,360,[180,90,270,300]);
  return mk(`三角形の 3つの角を あわせると なん度？`,180,[90,270,360,150]);}
function g4area(){const t=R(2);
  if(t===0){const a=R(9)+2,b=R(9)+2;return mk(`たて${a}cm よこ${b}cm の 長方形の 面積は？（cm²）`,a*b,[a+b,2*(a+b),a*b+a]);}
  const s=R(8)+2;return mk(`1ぺんが ${s}cm の 正方形の 面積は？（cm²）`,s*s,[s*4,s*2,s*s+s]);}
function g4decimal(){const t=R(2);
  if(t===0){const a=(R(89)+10)/10,b=(R(89)+10)/10,ans=Math.round((a+b)*10)/10;
    return mk(`${a.toFixed(1)} ＋ ${b.toFixed(1)} ＝ ？`,ans.toFixed(1),
      [(ans+0.1).toFixed(1),(ans-0.1).toFixed(1),(ans+1).toFixed(1)]);}
  const d=R(8)+1,m=R(7)+2,ans=Math.round(d/10*m*10)/10;
  return mk(`0.${d} × ${m} ＝ ？`,ans.toFixed(1),
    [(ans+0.1).toFixed(1),(ans+d/10).toFixed(1),(ans>0.1?ans-0.1:ans+0.2).toFixed(1)]);}
function g4frac(){const d=pick([3,4,5,6]),whole=R(2)+1,rem=R(d-1)+1,imp=whole*d+rem;
  if(R(2))return mk(`${d}ぶんの${imp} を 帯分数に すると？`,`${whole}と${d}ぶんの${rem}`,
    [`${whole+1}と${d}ぶんの${rem}`,`${whole}と${d}ぶんの${(rem%(d-1))+1}`,`${whole-1>0?whole-1:whole+2}と${d}ぶんの${rem}`]);
  return mk(`${whole}と${d}ぶんの${rem} を 仮分数に すると？`,`${d}ぶんの${imp}`,
    [`${d}ぶんの${imp+1}`,`${d}ぶんの${imp-1}`,`${d}ぶんの${whole+rem}`]);}
/* ── 特別枠：偉人・名言（学年に関係なく出題） ── */
function ijinPerson(pool){const it=pick(pool);
  const q=`${it.era}\n・${it.c[0]}\n・${it.c[1]}\n・${it.c[2]}\nこの{人|ひと}は だれ？`;
  return mk(q,it.name,shuffle(pool.filter(p=>p.name!==it.name)).slice(0,3).map(p=>p.name));}
