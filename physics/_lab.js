"use strict";
/* ============================================================
 * ぶつりラボ 共通ヘルパー（physics/_lab.js）
 *  各 physics/xxx.html の <head> で、スタイルシートの すぐ下に
 *    <script>window.LAB_WHY={q:"…", try:"…"};</script>   ← 任意（「🤔 なぜ？」パネルの中身）
 *    <script src="_lab.js"></script>
 *  を入れると、次の2つが 全シミュ共通で 効く。
 *   1) 省電力: タブが 見えなくなったら requestAnimationFrame を 止める
 *      （TVブラウザなど RAF を止めない環境でも 確実に アニメを停止。見えたら再開）
 *   2) 「🤔 なぜ？」問いかけパネルを 画面上部に 表示（観察のまえに 予想させる）
 *  ※ この2つは 各シミュのコードを 1行も 変えずに 動く（RAFを ラップし、DOMに 後入れするだけ）。
 * ========================================================== */
(function(){
  /* ---- 1) 省電力: タブ非表示中は requestAnimationFrame を止める ---- */
  const raw = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function(cb){ return setTimeout(function(){ cb(performance.now()); }, 16); };
  let pending = [];                         // 非表示中に たまった コールバック
  window.requestAnimationFrame = function(cb){
    if(document.hidden){ pending.push(cb); return -1; }   // 見えない間は スケジュールしない
    return raw(cb);
  };
  document.addEventListener("visibilitychange", function(){
    if(!document.hidden && pending.length){                // また 見えたら たまっていた ぶんを 再開
      const q = pending; pending = [];
      q.forEach(function(cb){ raw(cb); });
    }
  }, false);

  /* ---- 2) 「🤔 なぜ？」問いかけパネルを 挿入 ---- */
  function injectWhy(){
    const cfg = window.LAB_WHY;
    if(!cfg) return;
    if(document.querySelector(".why-panel")) return;       // 二重挿入ぼうし
    const q = (typeof cfg === "string") ? cfg : (cfg.q || "");
    if(!q) return;
    const tryTx = (cfg && cfg.try)
      ? '<span class="why-try">やってみよう：' + cfg.try + '</span>' : "";
    const panel = document.createElement("div");
    panel.className = "why-panel";
    panel.innerHTML =
      '<span class="why-emoji">🤔</span>' +
      '<span class="why-tx"><b>なぜ？</b>' + q + tryTx + '</span>';
    /* タイトルの すぐ下に 置く（無ければ #app の先頭、それも無ければ body 先頭） */
    const title = document.querySelector(".pagetitle");
    const appEl = document.getElementById("app") || document.body;
    if(title && title.parentNode){ title.insertAdjacentElement("afterend", panel); }
    else if(appEl.firstChild){ appEl.insertBefore(panel, appEl.firstChild); }
    else { appEl.appendChild(panel); }
  }
  /* ---- 3) 描画域が あとから 変わっても キャンバスの 縦横比を たもつ ----
   *  各シミュは 読み込み時に fitCanvas() を 1回だけ 呼ぶ。だが そのあとで
   *   ・「🤔 なぜ？」パネルの 後入れ挿入   ・Webフォントの 読み込み完了
   *  で 描画域(.cv-wrap)の 高さが 縮むと、キャンバスの インライン幅だけが 古い（広い）まま
   *  残り、CSSの max-height で 高さだけ つぶれて 横に のびて 見える（円が 横長の 楕円に なる）。
   *  とくに ウィンドウが 横長・低い とき（ノートPCなど）に 起きやすい。
   *  そこで レイアウトが 変わるたびに resize を 発火し、各シミュの fitCanvas
   *  （window の "resize" で 再計算）を 呼び直して 縦横比を もとに もどす。 */
  function refit(){ try{ window.dispatchEvent(new Event("resize")); }catch(e){} }
  function watchLayout(){
    var cv = document.querySelector("canvas.playcv") || document.querySelector("canvas");
    if(cv && cv.parentElement && window.ResizeObserver){
      // 描画域の 大きさが 変わったら（パネル挿入・フォント確定・ウィンドウ変形）自動で 再フィット
      try{ new ResizeObserver(refit).observe(cv.parentElement); }catch(e){}
    }
    refit();                                              // いま すぐ 1回
    if(typeof requestAnimationFrame === "function"){ requestAnimationFrame(refit); } // 次フレームでも
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(refit); }  // フォント確定後
  }
  function labInit(){ injectWhy(); watchLayout(); }
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", labInit, false);
  }else{
    labInit();
  }
})();
