/* MADE Manufaktura Mebli — interakcje (menu, reveal, parallax, galeria, filtry, formularz) */

/* --- menu mobilne --- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () { links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('open'); });
  });
})();

/* --- nav po scrollu --- */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  var tick = false;
  function upd() { nav.classList.toggle('is-stuck', window.scrollY > 20); tick = false; }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(upd); }
  }, { passive: true });
  upd();
})();

/* --- reveal --- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(function (el) { io.observe(el); });
  // to, co widać od razu — bez czekania na scroll
  requestAnimationFrame(function () {
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { el.classList.add('in'); io.unobserve(el); }
    });
  });
  // bezpiecznik — gdyby observer nie zadziałał
  setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 3000);
})();

/* --- delikatny parallax tła hero --- */
(function () {
  var bg = document.querySelector('.hero-bg');
  if (!bg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 760) return;
  var tick = false;
  function upd() {
    var y = window.scrollY;
    if (y < window.innerHeight * 1.2) bg.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0)';
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(upd); }
  }, { passive: true });
  upd();
})();

/* --- filtry galerii --- */
(function () {
  var bar = document.querySelector('.filters');
  if (!bar) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal .gitem'));
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    bar.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    var f = b.dataset.filter;
    items.forEach(function (it) {
      var show = (f === 'all' || it.dataset.cat === f);
      it.style.display = show ? '' : 'none';
    });
  });
})();

/* --- lightbox --- */
(function () {
  var lb = document.querySelector('.lb');
  if (!lb) return;
  var img = lb.querySelector('img');
  var cap = lb.querySelector('.lb-cap');
  var idx = 0;

  function visible() {
    return Array.prototype.slice.call(document.querySelectorAll('.gal .gitem'))
      .filter(function (it) { return it.style.display !== 'none'; });
  }
  function show(i) {
    var list = visible();
    if (!list.length) return;
    idx = (i + list.length) % list.length;
    var it = list[idx];
    var src = it.dataset.full || it.querySelector('img').getAttribute('src');
    img.src = src;
    img.alt = it.querySelector('img').alt || '';
    var b = it.querySelector('.cap b');
    cap.textContent = b ? b.textContent : '';
  }
  document.addEventListener('click', function (e) {
    var it = e.target.closest('.gal .gitem');
    if (!it) return;
    var list = visible();
    show(list.indexOf(it));
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; img.src = ''; }
  lb.querySelector('.lb-x').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

/* --- formularz (demo — bez wysyłki) --- */
(function () {
  var form = document.querySelector('form[data-demo]');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var box = form.querySelector('.form-msg');
    if (box) {
      box.textContent = 'To wersja demonstracyjna — formularz nie wysyła wiadomości. Zadzwoń: 666 510 870.';
      box.style.display = 'block';
    }
  });
})();

/* --- licznik odsłon dema (wewnętrzny) --- */
(function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if((document.referrer||'').indexOf('crm-newbeginning')>-1)return;if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/rest/v1/demo_views';var KEY='sb_publishable_MWwoyGlSCWnJ4awtOPF0ow_ZVS0Y8qK';function send(g){try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json','apikey':KEY,'Authorization':'Bearer '+KEY,'Prefer':'return=minimal'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null),ip:(g&&g.ip)||null,country:(g&&g.cc)||null,city:(g&&g.city)||null})}).catch(function(){});}catch(e){}}var done=false;function once(g){if(done)return;done=true;send(g);}try{var t=setTimeout(function(){once(null);},1500);fetch('https://ipwho.is/?fields=ip,success,country_code,city',{cache:'no-store'}).then(function(r){return r.json();}).then(function(d){clearTimeout(t);once(d&&d.success!==false?{ip:d.ip,cc:d.country_code,city:d.city}:null);}).catch(function(){clearTimeout(t);once(null);});}catch(e){once(null);}}catch(e){}})();
