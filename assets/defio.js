/* ================================================================
   Defio Coupon - phan dung chung cho moi trang (B2).
   Can nap SAU assets/data.js.
   ================================================================ */

/* Logo "the gia" (phuong an A) - cung hinh voi favicon.svg */
var BRAND_MARK='<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="dcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B7BFF"/><stop offset="1" stop-color="#5236E0"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#dcg)"/><path d="M33.5 12H48a4 4 0 0 1 4 4v14.5a4 4 0 0 1-1.2 2.8L33.3 50.8a4 4 0 0 1-5.6 0L13.2 36.3a4 4 0 0 1 0-5.6L30.7 13.2A4 4 0 0 1 33.5 12z" fill="#fff"/><circle cx="42.5" cy="21.5" r="4.2" fill="#6246EA"/></svg>';

/* Header: <header class="wrap hd" id="siteHeader" data-active="blog" data-search="off"> */
function renderSiteHeader(){
  var el=document.getElementById('siteHeader'); if(!el)return;
  var active=el.dataset.active||'';
  var nav=[['codes','/','Codes'],['stores','/#stores','Stores A–Z'],['blog','/blog','Blog'],['about','/about','About']];
  var q=new URLSearchParams(location.search).get('q')||'';
  el.innerHTML='<a href="/" class="brand" aria-label="Defio Coupon home">'+BRAND_MARK+'Defio<span class="brand-sub">Coupon</span></a>'
    +'<nav class="nav" aria-label="Main">'+nav.map(function(n){return '<a href="'+n[1]+'"'+(n[0]===active?' aria-current="page"':'')+'>'+n[2]+'</a>'}).join('')+'</nav>'
    +(el.dataset.search==='off'
      ? '<div class="hd-right"><i class="live" aria-hidden="true"></i><span>Codes updated daily</span></div>'
      : '<form class="hd-search" action="/" role="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" name="q" value="'+escapeHTML(q)+'" placeholder="Search stores and codes" aria-label="Search stores and codes"></form>');
}

/* Footer: <footer class="site-foot" id="siteFooter"></footer> */
function renderSiteFooter(){
  var el=document.getElementById('siteFooter'); if(!el)return;
  el.innerHTML='<div class="wrap"><div class="foot">'
    +'<div><div class="brand">'+BRAND_MARK+'Defio<span class="brand-sub">Coupon</span></div><p style="margin:0;max-width:32ch">Verified promo codes for independent brands, updated as stores send them in.</p></div>'
    +'<div><h4>Categories</h4><div class="foot-cats">'+CATEGORIES.map(function(c){return '<a href="/category/'+c.slug+'">'+escapeHTML(c.en)+'</a>'}).join('')+'</div></div>'
    +'<div><h4>Company</h4><div class="foot-links"><a href="/about">About us</a><a href="/contact">Contact</a><a href="/blog">Blog</a><a href="/privacy-policy">Privacy policy</a><a href="/terms-of-use">Terms of use</a></div></div>'
    +'</div><p class="foot-note">We may earn a commission when you use a code or link to buy something. Check each code on the store\'s checkout page before you pay. © 2026 Defio Coupon.</p></div>';
}

/* ----- icons ----- */
var ICONS={
  all:'<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  'arts-entertainment':'<path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.5 0-1-.8-1.3-.8-2.3 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="8" r="1"/>',
  business:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M3 13h18"/>',
  'clothing-accessories':'<path d="M8 3 3 6l2 4 2-1v11h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
  'food-gifts':'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4.5 8.5 8 12 8zm0 0s1.5-4 4-3.5S15.5 8 12 8z"/>',
  'health-beauty':'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  'home-garden':'<path d="M3 11 12 4l9 7M5.5 9.5V20h13V9.5M10 20v-6h4v6"/>',
  'life-family':'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-3.5-5.4"/>',
  'sports-fitness':'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  'tech-electronics':'<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  travel:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  'ai-saas':'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  other:'<path d="M3 12V4h8l10 10-8 7z"/><circle cx="7.5" cy="7.5" r="1.3"/>'
};
function icon(k){return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[k]||ICONS.other)+'</svg>'}
var CHECK='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
var STAR='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor" stroke="none"/></svg>';
var ARROW='<svg class="i" viewBox="0 0 24 24" aria-hidden="true" style="width:16px;height:16px"><path d="M7 17 17 7M9 7h8v8"/></svg>';

/* ----- helpers ----- */
function normKey(s){return (s||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
/* Tach chuoi "% Giam" trong Sheet thanh phan lon/nho de hien thi. */
function fmtDisc(s){
  s=(s||'').trim();
  var m=s.match(/(\d+)\s*%/);
  if(m){
    var pre=s.slice(0,m.index).trim().toLowerCase(), post=s.slice(m.index+m[0].length).trim().toLowerCase();
    return {pre:pre, big:m[1]+'%', post:post||'off'};
  }
  if(/^free/i.test(s)||!/\$/.test(s)) return {pre:'', big:s?s.charAt(0)+s.slice(1).toLowerCase():'Shop deal', post:'', word:true};
  m=s.match(/\$\s?[\d.,]+\+?/);
  return {pre:s.slice(0,m.index).trim().toLowerCase(), big:m[0].replace(/\s/g,''), post:s.slice(m.index+m[0].length).trim().toLowerCase()};
}
function discOf(p){return (p.offers.find(function(o){return o.discount})||{}).discount}
function pct(p){return Math.max.apply(null,[0].concat(p.offers.map(function(o){var m=(o.discount||'').match(/(\d+)\s*%/);return m?+m[1]:0})))}
function codeOf(p){var o=p.offers.find(function(o){return o.code});return o?o.code:''}
function isExclusive(p){return p.offers.some(function(o){return /defio/i.test(o.code||'')})}
function mask(c){return c.length<=3?'•••':'•'.repeat(Math.min(5,c.length-2))+c.slice(-2)}
function productHref(p){return '/coupons/'+encodeURIComponent(p.slug)}
/* Anh Shopify: xin ban 1200px cho nhe */
function sized(u,w){
  if(!u||!/cdn\.shopify\.com|\/cdn\/shop\//.test(u)||/[?&]width=/.test(u)) return u||'';
  return u+(u.indexOf('?')===-1?'?':'&')+'width='+(w||1200);
}
function logoHTML(p,cls,fb){
  var init=escapeHTML(p.brand.charAt(0));
  return p.logo?'<img class="'+cls+'" src="'+escapeHTML(p.logo)+'" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;'+cls+' '+fb+'&quot;>'+init+'</span>\'">':'<span class="'+cls+' '+fb+'">'+init+'</span>';
}

/* Dong coupon dang bang (trang chu, danh muc, trang shop) */
function rowHTML(p){
  var d=fmtDisc(discOf(p)), code=codeOf(p), n=p.offers.filter(function(o){return o.code}).length;
  var cta=code
    ? '<span class="cta"><span class="code">'+escapeHTML(mask(code))+'</span><span class="go">'+(n>1?n+' codes':'Get code')+'</span></span>'
    : '<span class="cta deal"><span class="go">See deal'+ARROW+'</span></span>';
  return '<a class="row" href="'+productHref(p)+'">'
    +'<div class="cell-store">'+logoHTML(p,'logo','fallback')+'<div style="min-width:0">'
      +'<div class="meta"><strong>'+escapeHTML(p.brand)+'</strong>'+(code?'<span class="ok">'+CHECK+'Verified</span>':'')+(isExclusive(p)?'<span class="excl">'+STAR+'Defio exclusive</span>':'')+'</div>'
      +'<h3>'+escapeHTML(p.title)+'</h3></div></div>'
    +'<div class="disc">'+(d.pre?'<span class="small">'+escapeHTML(d.pre)+'</span>':'')+'<span class="big'+(d.word?' is-word':'')+'">'+escapeHTML(d.big)+'</span>'+(d.post?'<span class="small">'+escapeHTML(d.post)+'</span>':'')+'</div>'
    +cta+'</a>';
}
function skeletonRows(n){return Array(n+1).join('<div class="skel"><i class="sq"></i><div><i></i><i></i></div><i class="bt"></i></div>')}

/* Anh dai dien cho shop: cot "Anh san pham" neu co, khong thi anh dau tien cua bai blog cung ten */
function blogImageMap(posts){
  var m={}; (posts||[]).forEach(function(p){if(p.images&&p.images.length&&!m[normKey(p.title)])m[normKey(p.title)]=p.images[0]}); return m;
}
function productImage(p,imgMap){return p.image||(imgMap&&imgMap[normKey(p.brand)])||''}

function dealCardHTML(p,img){
  var d=fmtDisc(discOf(p)), code=codeOf(p);
  return '<a class="dcard" href="'+productHref(p)+'">'
    +'<div class="dcard-img"><img src="'+escapeHTML(sized(img,800))+'" alt="'+escapeHTML(p.brand)+'" loading="lazy"><span class="dcard-badge">'+(d.word?escapeHTML(d.big):(d.pre?escapeHTML(d.pre)+' ':'')+'<b>'+escapeHTML(d.big)+'</b>'+(d.post?' '+escapeHTML(d.post):''))+'</span></div>'
    +'<div class="dcard-body"><div class="dcard-brand">'+(p.logo?'<img src="'+escapeHTML(p.logo)+'" alt="" loading="lazy" onerror="this.remove()">':'')+'<strong>'+escapeHTML(p.brand)+'</strong>'+(code?'<span class="ok">'+CHECK+'Verified</span>':'')+'</div>'
    +'<h3>'+escapeHTML(p.title)+'</h3>'
    +'<div class="dcard-foot">'+(code?'<span class="code">'+escapeHTML(mask(code))+'</span><span class="go">Get code</span>':'<span>No code needed</span><span class="go">See deal</span>')+'</div></div></a>';
}

/* Tieu de SEO + mo ta cua bai blog (dong 1 va dong "Meta description:") */
function postHeadline(post){
  var lines=(post.content||'').split(/\r?\n/).map(function(l){return l.trim()}).filter(Boolean);
  var title=post.title, desc='';
  if(lines.length&&!/^meta description:/i.test(lines[0])&&lines[0].length<160&&lines[0].indexOf('## ')!==0)title=lines.shift();
  if(lines.length&&/^meta description:/i.test(lines[0]))desc=lines[0].replace(/^meta description:\s*/i,'');
  return {title:title,desc:desc};
}
function postCardHTML(post){
  var h=postHeadline(post);
  return '<a class="pcard" href="/blog/'+encodeURIComponent(post.slug)+'">'
    +(post.images[0]?'<img src="'+escapeHTML(sized(post.images[0],800))+'" alt="" loading="lazy">':'')
    +'<div><b>'+escapeHTML(post.title)+'</b><span>'+escapeHTML(h.title)+'</span>'+(h.desc?'<p>'+escapeHTML(h.desc)+'</p>':'')+'</div></a>';
}

/* ----- tai du lieu co bo nho tam -----
   opensheet co the mat 5-15s. Luu ban gan nhat tren may nguoi xem de
   lan sau hien ngay, roi am tham cap nhat ban moi. cb(data, laBanLuu) */
function cacheGet(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function cacheSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function loadCoupons(cb, onErr){
  var c=cacheGet('defio_data_v1'), had=false;
  if(c&&c.coupons&&c.coupons.length){had=true;cb(c,true);}
  fetchData().then(function(d){
    if(!d.coupons.length&&had)return;
    cacheSet('defio_data_v1',d); cb(d,false);
  }).catch(function(e){console.error(e); if(!had&&onErr)onErr(e);});
}
function loadBlog(cb){
  var c=cacheGet('defio_blog_v1'), had=false;
  if(c&&c.length){had=true;cb(c,true);}
  fetchBlogPosts().then(function(p){
    if(!p.length&&had)return;
    cacheSet('defio_blog_v1',p); cb(p,false);
  });
}

function ensureToast(){if(!document.getElementById('toast')){var t=document.createElement('div');t.className='toast';t.id='toast';t.setAttribute('role','status');document.body.appendChild(t);}}

renderSiteHeader();
renderSiteFooter();
ensureToast();
