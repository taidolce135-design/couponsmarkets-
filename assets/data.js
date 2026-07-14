/* ================================================================
   CHO NAY ANH DAN LINK OPENSHEET VAO (dung chung cho moi trang)
   ================================================================ */
const SHEET_COUPONS_URL = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/M%C3%A3%20Coupon"; // <-- link tab "Mã Coupon"
const SHEET_BRANDS_URL  = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/%E1%BA%A2nh%20Web"; // <-- link tab "Ảnh Web"

/* ================================================================
   TEN COT TRONG SHEET (khop dung voi Sheet cua anh)
   ================================================================ */
const COL = {
  brand:    "Brand",
  logo:     "Logo",
  title:    "Tiêu đề tiếng Anh",
  desc:     "Mô tả tiếng Anh",
  code:     "Mã Coupon",
  url:      "Link affiliate",
  discount: "% Giảm",
  category: "Category"
};
const BRAND_COL = { name:"Name", img:"img" };

/* ================================================================
   GIAO DIEN SONG NGU (chu co dinh). Mac dinh EN, them ?vn -> VI.
   ================================================================ */
const UI = {
  en:{searchPh:"Search stores, products, codes...",navAll:"All",navPhys:"Physical",navDig:"Digital",
    heroTitle:"Latest promo codes, updated every day",
    heroSub:"Verified coupons and vouchers for physical and digital products. Click to reveal the code - no sign-up needed.",
    chipAll:"All",chipPhys:"Physical products",chipDig:"Digital products",
    reveal:"Get Code",copy:"Copy",deal:"Get Deal",copied:"Code copied: ",
    empty:"No matching codes. Try another keyword.",loading:"Loading codes...",
    err:"Could not load codes. Please refresh the page.",
    footTag:"Trusted coupons, updated daily.",footInfo:"Information",footAbout:"About us",
    footPrivacy:"Privacy Policy",footTerms:"Terms of Use",footContact:"Contact",
    footNote:"We may earn a commission when you use a code or link to make a purchase. Please verify each code on the merchant site before checkout. (c) 2026 CouponVault. All rights reserved.",
    breadcrumbHome:"Home",
    storeTitle:"{brand} Coupons & Promo Codes 2026 | Verified Codes",
    storeMetaDesc:"{brand} coupons & promo codes 2026 - verified codes and deals, updated regularly. Click to copy and save at {brand}.",
    storeSub:"Verified {brand} coupons and deals, updated regularly. Click to reveal the code.",
    storeNotFoundTitle:"Store not found",
    storeNotFoundSub:"We could not find this store. Browse all current coupons instead.",
    backHome:"Back to homepage"},
  vi:{searchPh:"Tim cua hang, san pham, ma...",navAll:"Tat ca",navPhys:"Vat ly",navDig:"San pham so",
    heroTitle:"Ma giam gia moi nhat, cap nhat moi ngay",
    heroSub:"Coupon va voucher da kiem tra cho san pham vat ly lan san pham so. Bam de hien ma - khong can dang ky.",
    chipAll:"Tat ca",chipPhys:"San pham vat ly",chipDig:"San pham so",
    reveal:"Hien ma",copy:"Sao chep",deal:"Lay uu dai",copied:"Da sao chep ma: ",
    empty:"Khong tim thay ma phu hop.",loading:"Dang tai ma...",
    err:"Khong tai duoc du lieu. Anh kiem tra lai link Sheet nhe.",
    footTag:"Tong hop ma giam gia uy tin, cap nhat hang ngay.",footInfo:"Thong tin",footAbout:"Ve chung toi",
    footPrivacy:"Chinh sach bao mat",footTerms:"Dieu khoan su dung",footContact:"Lien he",
    footNote:"Chung toi co the nhan hoa hong khi ban dung ma/lien ket de mua hang. Vui long kiem tra ma tren website nguoi ban truoc khi thanh toan. (c) 2026 CouponVault. Bao luu moi quyen.",
    breadcrumbHome:"Trang chu",
    storeTitle:"Ma giam gia {brand} 2026 | Ma da kiem tra",
    storeMetaDesc:"Ma giam gia {brand} 2026 - ma da kiem tra, cap nhat thuong xuyen. Bam de sao chep va tiet kiem tai {brand}.",
    storeSub:"Ma giam gia va uu dai da kiem tra cho {brand}, cap nhat thuong xuyen. Bam de hien ma.",
    storeNotFoundTitle:"Khong tim thay cua hang",
    storeNotFoundSub:"Khong tim thay cua hang nay. Xem tat ca ma giam gia hien co.",
    backHome:"Ve trang chu"}
};

function detectLang(){
  const p = new URLSearchParams(location.search);
  if(p.has('vn') || location.hash.toLowerCase()==='#vn') return 'vi';
  return 'en';
}
const lang = detectLang();

function tpl(str, vars){
  return str.replace(/\{(\w+)\}/g, function(_, k){ return vars[k]!==undefined ? vars[k] : ''; });
}

function slugify(s){
  return (s||"").toString().trim().toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

function showToast(msg){
  const toast=document.getElementById('toast');
  if(!toast)return;
  toast.textContent=msg;toast.classList.add('show');
  clearTimeout(window._t);window._t=setTimeout(function(){toast.classList.remove('show')},1800);
}

function fetchData(){
  if(!SHEET_COUPONS_URL){
    return Promise.resolve({
      coupons:[
        {brand:"Sirui",logo:"",title:"Enjoy Fast Savings 5% Off",desc:"Get Sirui promo code at checkout and enjoy 5% off.",code:"UPA-TAINGUYENNHU",url:"#",discount:"5%",category:"physical"},
        {brand:"Soulflower",logo:"",title:"Top Coupon Codes Today",desc:"Save 5% off on all products with Soulflower coupon.",code:"SHMEDIA",url:"#",discount:"5%",category:"physical"}
      ],
      brands:[]
    });
  }
  return Promise.all([
    fetch(SHEET_COUPONS_URL).then(function(r){return r.json()}),
    SHEET_BRANDS_URL ? fetch(SHEET_BRANDS_URL).then(function(r){return r.json()}) : Promise.resolve([])
  ]).then(function(res){
    const rowsC=res[0]||[], rowsB=res[1]||[];
    const coupons = rowsC.map(function(r){
      return {
        brand:(r[COL.brand]||"").trim(),
        logo:(r[COL.logo]||"").trim(),
        title:(r[COL.title]||"").trim(),
        desc:(r[COL.desc]||"").trim(),
        code:(r[COL.code]||"").trim(),
        url:(r[COL.url]||"#").trim(),
        discount:(r[COL.discount]||"").trim(),
        category:((r[COL.category]||"physical").trim().toLowerCase().indexOf('dig')===0?'digital':'physical')
      };
    }).filter(function(c){return c.brand});
    const brands = rowsB.map(function(r){
      return {name:(r[BRAND_COL.name]||"").trim(), img:(r[BRAND_COL.img]||"").trim()};
    }).filter(function(b){return b.img});
    return {coupons:coupons, brands:brands};
  });
}

function renderMarquee(brands, marqueeEl, trackEl){
  if(!brands.length){marqueeEl.style.display='none';return;}
  marqueeEl.style.display='';
  const one=brands.map(function(b){
    return '<div class="marquee-item"><img src="'+b.img+'" alt="'+b.name+'" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>';
  }).join('');
  trackEl.innerHTML=one+one;
}

function cardHTML(c, t, opts){
  opts=opts||{};
  const tagTxt=c.category==='digital'?t.chipDig:t.chipPhys;
  const logo=c.logo
    ? '<img class="brand-logo" src="'+c.logo+'" alt="'+c.brand+'" loading="lazy" onerror="this.outerHTML=\'<div class=\\\'brand-fallback\\\'>'+c.brand.charAt(0)+'</div>\'">'
    : '<div class="brand-fallback">'+c.brand.charAt(0)+'</div>';
  const tag='<span class="tag '+(c.category==='digital'?'digital':'')+'">'+tagTxt+'</span>';
  const disc=c.discount?'<span class="discount">'+c.discount+'</span>':'';
  const action=c.code
    ? '<div class="code-btn" data-code="'+c.code+'" data-url="'+c.url+'"><div class="code-text">'+c.code+'</div><div class="code-action">'+t.reveal+'</div></div>'
    : '<a class="deal-btn" href="'+c.url+'" target="_blank" rel="nofollow noopener sponsored">'+t.deal+'</a>';
  const brandName = opts.linkBrand===false
    ? c.brand
    : '<a href="/site/'+slugify(c.brand)+'">'+c.brand+'</a>';
  return '<article class="card"><div class="card-top">'+logo+'<div style="min-width:0">'+tag+'<div class="brand-name">'+brandName+'</div></div>'+disc+'</div><h3>'+c.title+'</h3><p class="desc">'+c.desc+'</p>'+action+'</article>';
}

/* Mo tab affiliate NGAM phia sau (background tab), khach van o lai trang coupon */
function openAffiliateInBackground(url){
  if(!url||url.indexOf('#')===0)return;
  const a=document.createElement('a');
  a.href=url; a.target='_blank'; a.rel='nofollow noopener sponsored';
  a.style.display='none'; document.body.appendChild(a);
  const ev=new MouseEvent('click',{ctrlKey:true,metaKey:true,button:1,bubbles:false});
  a.dispatchEvent(ev);
  document.body.removeChild(a);
  setTimeout(function(){window.focus();},0);
}

function attachCodeEvents(gridEl){
  gridEl.addEventListener('click',function(e){
    const btn=e.target.closest('.code-btn');if(!btn)return;
    const code=btn.dataset.code,url=btn.dataset.url,t=UI[lang];
    if(!btn.classList.contains('revealed')){
      btn.classList.add('revealed');
      btn.querySelector('.code-action').textContent=t.copy;
      if(navigator.clipboard)navigator.clipboard.writeText(code).then(function(){showToast(t.copied+code)});
      openAffiliateInBackground(url);
    }else{
      if(navigator.clipboard)navigator.clipboard.writeText(code).then(function(){showToast(t.copied+code)});
    }
  });
}

function applyFooterUI(t){
  const set=function(id,val){const el=document.getElementById(id);if(el)el.textContent=val;};
  set('footTag',t.footTag);set('footInfo',t.footInfo);set('footAbout',t.footAbout);
  set('footPrivacy',t.footPrivacy);set('footTerms',t.footTerms);set('footContact',t.footContact);
  set('footNote',t.footNote);
}

/* Structured data: mo ta cac ma giam gia bang schema.org, khong bia dat gia/tien te
   de tranh bi Google Search Console canh bao structured-data sai. */
function buildCouponJsonLd(coupons){
  const origin = location.origin;
  return {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "itemListElement": coupons.map(function(c,i){
      return {
        "@type":"ListItem",
        "position": i+1,
        "item":{
          "@type":"Offer",
          "name": c.title,
          "description": c.desc,
          "url": origin + '/site/' + slugify(c.brand),
          "category": c.category,
          "seller":{"@type":"Organization","name":c.brand}
        }
      };
    })
  };
}

function injectJsonLd(obj, id){
  const existing=document.getElementById(id);
  if(existing)existing.remove();
  const s=document.createElement('script');
  s.type='application/ld+json'; s.id=id;
  s.textContent=JSON.stringify(obj);
  document.head.appendChild(s);
}
