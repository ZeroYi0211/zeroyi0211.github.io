(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const meta = JSON.parse($('#book-meta').textContent);
  const articles = $$('.chapter');
  const rendered = new Set();
  let current = 0, changing = false, prefs = {}, saved;
  try { prefs = JSON.parse(localStorage.getItem('control-preferences') || '{}'); saved = JSON.parse(localStorage.getItem('control-reading') || 'null'); } catch {}
  let size = prefs.size || 18;
  const persistPrefs = () => { try { localStorage.setItem('control-preferences', JSON.stringify({size,theme:document.documentElement.dataset.theme || 'light'})); } catch {} };
  const hashTarget = () => /^#c(\d+)(?:-s(\d+))?$/.exec(location.hash);
  const drawProgress = () => {
    const max = Math.max(1,document.documentElement.scrollHeight-innerHeight);
    $('.reading-progress span').style.width = Math.min(100,Math.max(0,scrollY/max*100))+'%';
  };
  function markWideFormulas() {
    articles[current].querySelectorAll('.equation').forEach(el=>el.classList.toggle('is-wide',el.scrollWidth>el.clientWidth+3));
  }
  function drawer(open) {
    $('.sidebar').classList.toggle('is-open',open); $('.drawer-shade').hidden=!open;
    $('#menu').setAttribute('aria-expanded',String(open));
    if(open) $('.sidebar .active').focus();
  }
  async function show(ci, anchor, ratio=0, focus=false) {
    ci=Math.max(0,Math.min(meta.length-1,ci)); changing=true; current=ci;
    articles.forEach((a,i)=>a.hidden=i!==ci);
    $$('.chapter-link').forEach((b,i)=>{b.classList.toggle('active',i===ci);b.setAttribute('aria-current',i===ci?'page':'false');});
    $('.current-title').textContent=meta[ci].title;
    document.title=meta[ci].title+' · 经典控制口袋书';
    articles[ci].querySelector('.previous').disabled=ci===0;
    articles[ci].querySelector('.next').disabled=ci===meta.length-1;
    $('#section-links').replaceChildren(...meta[ci].toc.map(s=>{
      const b=document.createElement('button');b.textContent=s.title.replace(/\$/g,'');b.addEventListener('click',()=>navigate(ci,s.id,true));return b;
    }));
    drawer(false);
    if(!rendered.has(ci)) {
      try { await MathJax.startup.promise; await MathJax.typesetPromise([articles[ci]]); rendered.add(ci); }
      catch(e) { console.error('Formula rendering failed',e); }
    }
    await new Promise(requestAnimationFrame);
    if(anchor && document.getElementById(anchor)) {
      const target=document.getElementById(anchor);target.scrollIntoView();if(focus)target.focus({preventScroll:true});
    } else scrollTo(0,ratio*Math.max(0,document.documentElement.scrollHeight-innerHeight));
    changing=false; drawProgress();markWideFormulas();
  }
  function navigate(ci,anchor,focus=false) {
    const hash='#'+(anchor||'c'+ci);history.pushState(null,'',hash);return show(ci,anchor,0,focus);
  }
  $$('.chapter-link').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.chapter),null,true)));
  $$('[data-step]').forEach(b=>b.addEventListener('click',()=>navigate(current+Number(b.dataset.step),null,true)));
  $('#menu').addEventListener('click',()=>drawer(!$('.sidebar').classList.contains('is-open')));
  $('.drawer-close').addEventListener('click',()=>{drawer(false);$('#menu').focus();});
  $('.drawer-shade').addEventListener('click',()=>drawer(false));
  addEventListener('popstate',()=>{const h=hashTarget();show(h?Number(h[1]):0,h?.[2]?'c'+h[1]+'-s'+h[2]:null);});
  let timer;
  addEventListener('scroll',()=>{
    drawProgress();clearTimeout(timer);timer=setTimeout(()=>{
      if(changing||!$('#resume-note').hidden)return;
      const headings=[...articles[current].querySelectorAll('h2,h3')];
      const anchor=headings.filter(h=>h.getBoundingClientRect().top<innerHeight*.4).at(-1)?.id;
      try { localStorage.setItem('control-reading',JSON.stringify({chapter:current,anchor,ratio:scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})); } catch {}
    },250);
  },{passive:true});
  function changeSize(delta) {size=Math.max(16,Math.min(24,size+delta));document.documentElement.style.setProperty('--reading-size',size+'px');persistPrefs();drawProgress();markWideFormulas();}
  addEventListener('resize',markWideFormulas);
  $('#font-smaller').addEventListener('click',()=>changeSize(-1));$('#font-larger').addEventListener('click',()=>changeSize(1));
  function themeLabel(){const dark=document.documentElement.dataset.theme==='dark';$('#theme-toggle').textContent=dark?'日间':'夜间';$('#theme-toggle').setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式');}
  $('#theme-toggle').addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';persistPrefs();themeLabel();});themeLabel();
  // Index readable sections before MathJax adds its assistive and SVG content.
  const index=[];
  articles.forEach((article,ci)=>{
    let item={chapter:ci,title:meta[ci].title,anchor:'c'+ci,text:''};
    [...article.children].forEach(el=>{
      if(/^H[23]$/.test(el.tagName)){index.push(item);item={chapter:ci,title:el.textContent,anchor:el.id,text:''};}
      else if(!el.matches('header,footer'))item.text+=el.textContent+' ';
    });index.push(item);
  });
  const searchDialog=$('#search-dialog');
  $$('.search-trigger').forEach(b=>b.addEventListener('click',()=>{searchDialog.showModal();$('#search-input').focus();}));
  $('#search-input').addEventListener('input',()=>{
    const q=$('#search-input').value.trim().toLocaleLowerCase();const target=$('#search-results');target.replaceChildren();
    if(!q){$('#search-status').textContent='输入关键词，查找正文与小节。';return;}
    const found=index.filter(s=>(s.title+' '+s.text).toLocaleLowerCase().includes(q));
    $('#search-status').textContent=found.length?`找到 ${found.length} 个相关小节`:'没有匹配项，试试更短的关键词。';
    found.slice(0,60).forEach(s=>{
      const b=document.createElement('button');b.className='search-result';
      const title=document.createElement('strong');title.textContent=meta[s.chapter].title+' / '+s.title;
      const snippet=document.createElement('small');const n=s.text.toLocaleLowerCase().indexOf(q);snippet.textContent=(n>28?'…':'')+s.text.slice(Math.max(0,n-28),Math.max(0,n-28)+120).replace(/\\[()[\]]/g,'')+'…';
      b.append(title,snippet);b.addEventListener('click',()=>{searchDialog.close();navigate(s.chapter,s.anchor,true);});target.append(b);
    });
  });
  $$('.dialog-close').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
  $$('.figure-open').forEach(b=>b.addEventListener('click',()=>{
    const im=b.querySelector('img');$('#zoom-image').src=im.src;$('#zoom-image').alt=im.alt;$('#image-caption').textContent=im.alt;$('#image-dialog').showModal();
  }));
  for(let n=1;n<=126;n++){const o=document.createElement('option');o.value=n;o.textContent=n<=5?`${n} · 扉页与目录`:n===126?'126 · 封底':`${n}`;$('#source-select').append(o);}
  function sourcePage(n){n=Math.max(1,Math.min(126,n));$('#source-select').value=String(n);$('#source-image').src=`original/${String(n).padStart(3,'0')}.webp`;$('#source-image').alt=`原始扫描第 ${n} 页`;$('#source-prev').disabled=n===1;$('#source-next').disabled=n===126;}
  $('#source-open').addEventListener('click',()=>{sourcePage(meta[current].pages[0]);$('#source-dialog').showModal();});
  $('#source-select').addEventListener('change',e=>sourcePage(Number(e.target.value)));
  $('#source-prev').addEventListener('click',()=>sourcePage(Number($('#source-select').value)-1));$('#source-next').addEventListener('click',()=>sourcePage(Number($('#source-select').value)+1));
  addEventListener('keydown',e=>{
    if(e.key==='/'&&!document.querySelector('dialog[open]')&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();searchDialog.showModal();$('#search-input').focus();}
    if(e.key==='Escape')drawer(false);
  });
  const initial=hashTarget();
  if(initial) {
    const ci=Number(initial[1]);
    const restore=!initial[2]&&saved?.chapter===ci;
    show(ci,initial[2]?'c'+initial[1]+'-s'+initial[2]:restore?saved.anchor:null,restore?saved.ratio:0);
  }
  else {
    show(0);
    if(saved && meta[saved.chapter] && (saved.chapter>0||saved.ratio>.02)) {
      $('#resume-note').hidden=false;$('#resume-note span').textContent='上次读到：'+meta[saved.chapter].title;
      $('#resume-go').addEventListener('click',()=>{$('#resume-note').hidden=true;history.pushState(null,'','#c'+saved.chapter);show(saved.chapter,saved.anchor,saved.ratio);});
    }
  }
  $('#resume-dismiss').addEventListener('click',()=>$('#resume-note').hidden=true);
  window.readerReady=()=>!changing;
})();
