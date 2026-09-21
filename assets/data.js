/* ================================================================
   CHO NAY ANH DAN LINK OPENSHEET VAO (dung chung cho moi trang)
   ================================================================ */
const SHEET_COUPONS_URL = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/M%C3%A3%20Coupon"; // <-- link tab "Mã Coupon"
const SHEET_BRANDS_URL  = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/%E1%BA%A2nh%20Web"; // <-- link tab "Ảnh Web"
const SHEET_PAGES_URL   = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/Trang%20t%C4%A9nh"; // <-- link tab "Trang tĩnh" (tuy chon, de trong van chay duoc)
const SHEET_BLOG_URL    = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/B%C3%A0i%20Blog"; // <-- link tab "Bài Blog" (tuy chon, de trong van chay duoc)

/* ================================================================
   TEN COT TRONG SHEET (khop dung voi Sheet cua anh)
   ================================================================ */
const COL = {
  brand:       "Brand",
  logo:        "Logo",
  productSlug: "Mã sản phẩm",
  title:       "Tiêu đề tiếng Anh",
  desc:        "Mô tả tiếng Anh",
  code:        "Mã Coupon",
  url:         "Link affiliate",
  discount:    "% Giảm",
  category:    "Category",
  image:       "Ảnh sản phẩm",
  rating:      "Số sao",
  review:      "Đánh giá"
};
const BRAND_COL = { name:"Name", img:"img" };
const PAGE_COL  = { slug:"Slug", title:"Tiêu đề", content:"Nội dung", metaDesc:"Mô tả meta" };
const BLOG_COL  = { project:"Tên Dự Án", image:"Ảnh", content:"Nội Dung" };

/* ================================================================
   DANH MUC SAN PHAM (co dinh, 12 muc). Cot "Category" trong Sheet
   nhap dung 1 trong 12 ten tieng Viet duoi day (khong phan biet hoa/
   thuong, co dau hay khong dau deu duoc). Neu go sai/de trong -> "Khac".
   ================================================================ */
const CATEGORIES = [
  { slug:"arts-entertainment",   vi:"Nghệ thuật & Giải trí", en:"Arts & Entertainment", icon:"🎨" },
  { slug:"business",             vi:"Việc kinh doanh",       en:"Business", icon:"💼" },
  { slug:"clothing-accessories", vi:"Quần áo & Phụ kiện",    en:"Clothing & Accessories", icon:"👕" },
  { slug:"food-gifts",           vi:"Thực phẩm & Quà tặng",  en:"Food & Gifts", icon:"🎁" },
  { slug:"health-beauty",        vi:"Sức khỏe & Sắc đẹp",    en:"Health & Beauty", icon:"💄" },
  { slug:"home-garden",          vi:"Nhà cửa & Vườn",        en:"Home & Garden", icon:"🏡" },
  { slug:"life-family",          vi:"Cuộc sống & Gia đình",  en:"Life & Family", icon:"👨‍👩‍👧" },
  { slug:"sports-fitness",       vi:"Thể thao & Thể dục",    en:"Sports & Fitness", icon:"⚽" },
  { slug:"tech-electronics",     vi:"Công nghệ & Điện tử",   en:"Tech & Electronics", icon:"💻" },
  { slug:"travel",               vi:"Du lịch",               en:"Travel", icon:"✈️" },
  { slug:"ai-saas",              vi:"AI & SaaS",             en:"AI & SaaS", icon:"🤖" },
  { slug:"other",                vi:"Khác",                  en:"Other", icon:"🏷️" }
];

function normalizeVN(s){
  return (s||"").toString().trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/đ/g,'d');
}

function resolveCategory(raw){
  const norm = normalizeVN(raw);
  if(!norm) return "other";
  const found = CATEGORIES.find(function(c){
    return normalizeVN(c.vi)===norm || normalizeVN(c.en)===norm || c.slug===norm.replace(/\s+/g,'-');
  });
  return found ? found.slug : "other";
}

/* Mot cua hang co the thuoc nhieu danh muc, ngan cach boi dau phay
   trong Sheet (vd "Tech & Electronics, Business"). Tra ve mang slug
   duy nhat, khong trung. Neu de trong -> ["other"]. */
function resolveCategories(raw){
  const tokens=(raw||"").split(',').map(function(s){return s.trim()}).filter(Boolean);
  if(!tokens.length) return ["other"];
  const slugs=tokens.map(resolveCategory);
  return slugs.filter(function(s,i){return slugs.indexOf(s)===i});
}

function categoryLabel(slug){
  const c = CATEGORIES.find(function(c){return c.slug===slug}) || CATEGORIES[CATEGORIES.length-1];
  return lang==='vi' ? c.vi : c.en;
}

/* ================================================================
   GIAO DIEN SONG NGU (chu co dinh). Mac dinh EN, them ?vn -> VI.
   ================================================================ */
const UI = {
  en:{searchPh:"Search stores, products, codes...",
    heroTitle:"Latest promo codes, updated every day",
    heroSub:"Discover the latest coupon codes and special offers from your favorite online stores - simply choose a code and use it at checkout. Defio Coupon brings you promo codes, coupons, and online shopping deals for thousands of products and brands.",
    heroNote:"Click to reveal code - no registration required.",
    catAllLabel:"All Categories",
    reveal:"Get Code",copy:"Copy",deal:"Get Deal",copied:"Code copied: ",
    verifiedBadge:"Verified",codeTag:"CODE",dealTag:"DEAL",visitStore:"Visit Store",
    empty:"No matching codes. Try another keyword.",loading:"Loading codes...",
    err:"Could not load codes. Please refresh the page.",
    footTag:"Trusted coupons, updated daily.",footInfo:"Information",footAbout:"About us",
    footPrivacy:"Privacy Policy",footTerms:"Terms of Use",footContact:"Contact",
    footNote:"We may earn a commission when you use a code or link to make a purchase. Please verify each code on the merchant site before checkout. (c) 2026 Defio Coupon. All rights reserved.",
    breadcrumbHome:"Home",
    storeTitle:"{brand} Coupons & Promo Codes 2026 | Verified Codes",
    storeMetaDesc:"{brand} coupons & promo codes 2026 - verified codes and deals, updated regularly. Click to copy and save at {brand}.",
    storeSub:"Verified {brand} coupons and deals, updated regularly. Click to reveal the code.",
    storeNotFoundTitle:"Store not found",
    storeNotFoundSub:"We could not find this store. Browse all current coupons instead.",
    backHome:"Back to homepage",
    viewDeal:"View Coupon",
    viewCodesTpl:"View {n} Codes",
    productTitleTpl:"{title} - {brand} Coupon Code 2026",
    productMetaDescTpl:"{title} at {brand} - verified coupon codes and deals, updated regularly. Click to reveal and copy.",
    codesHeading:"Available codes",
    dealNotFoundTitle:"Deal not found",
    dealNotFoundSub:"We could not find this deal. Browse all current coupons instead.",
    pageNotFoundTitle:"Page not found",
    pageNotFoundSub:"We could not find this page.",
    categoryHeroTitleTpl:"{category} Coupons & Promo Codes",
    categoryTitleTpl:"{category} Coupons & Promo Codes 2026 | Verified Deals",
    categoryMetaDescTpl:"Browse verified {category} coupons and promo codes, updated regularly. Click to reveal and save.",
    categoryHeroSubTpl:"Verified {category} coupons and deals, updated regularly. Click to reveal the code.",
    categoryNotFoundTitle:"Category not found",
    categoryNotFoundSub:"We could not find this category. Browse all current coupons instead.",
    navBlog:"Blog",
    blogPageTitle:"Blog | Defio Coupon",
    blogPageMetaDesc:"Shopping tips, deal roundups and stories from the Defio Coupon team.",
    blogHeroTitle:"Defio Coupon Blog",
    blogHeroSub:"Shopping tips, deal roundups and stories from our team.",
    blogEmpty:"No blog posts yet.",
    blogPostNotFoundTitle:"Post not found",
    blogPostNotFoundSub:"We could not find this blog post. Browse all posts instead.",
    backToBlog:"Back to blog",
    catAllIcon:"🗂️",
    trustSecure:"Safe & secure",trustVerified:"Verified codes",trustDaily:"Updated daily",trustFree:"Free to use",
    howTitle:"How it works",
    howStep1Title:"Find a store or code",howStep1Sub:"Search or browse by category to find the deal you want.",
    howStep2Title:"Click to reveal",howStep2Sub:"Get the code instantly and copy it with one click.",
    howStep3Title:"Save at checkout",howStep3Sub:"Paste the code at your favorite store and enjoy the discount.",
    featuredTitle:"🔥 Featured deals this week",
    navAbout:"About",footCategories:"Categories"},
  vi:{searchPh:"Tim cua hang, san pham, ma...",
    heroTitle:"Ma giam gia moi nhat, cap nhat moi ngay",
    heroSub:"Kham pha ma giam gia va uu dai moi nhat tu cac cua hang truc tuyen yeu thich - chi can chon 1 ma va dung khi thanh toan. Defio Coupon mang den ma khuyen mai, coupon va uu dai mua sam cho hang ngan san pham va thuong hieu.",
    heroNote:"Bam de hien ma - khong can dang ky.",
    catAllLabel:"Tat ca danh muc",
    reveal:"Hien ma",copy:"Sao chep",deal:"Lay uu dai",copied:"Da sao chep ma: ",
    verifiedBadge:"Da xac thuc",codeTag:"MA",dealTag:"UU DAI",visitStore:"Toi cua hang",
    empty:"Khong tim thay ma phu hop.",loading:"Dang tai ma...",
    err:"Khong tai duoc du lieu. Anh kiem tra lai link Sheet nhe.",
    footTag:"Tong hop ma giam gia uy tin, cap nhat hang ngay.",footInfo:"Thong tin",footAbout:"Ve chung toi",
    footPrivacy:"Chinh sach bao mat",footTerms:"Dieu khoan su dung",footContact:"Lien he",
    footNote:"Chung toi co the nhan hoa hong khi ban dung ma/lien ket de mua hang. Vui long kiem tra ma tren website nguoi ban truoc khi thanh toan. (c) 2026 Defio Coupon. Bao luu moi quyen.",
    breadcrumbHome:"Trang chu",
    storeTitle:"Ma giam gia {brand} 2026 | Ma da kiem tra",
    storeMetaDesc:"Ma giam gia {brand} 2026 - ma da kiem tra, cap nhat thuong xuyen. Bam de sao chep va tiet kiem tai {brand}.",
    storeSub:"Ma giam gia va uu dai da kiem tra cho {brand}, cap nhat thuong xuyen. Bam de hien ma.",
    storeNotFoundTitle:"Khong tim thay cua hang",
    storeNotFoundSub:"Khong tim thay cua hang nay. Xem tat ca ma giam gia hien co.",
    backHome:"Ve trang chu",
    viewDeal:"Xem ma",
    viewCodesTpl:"Xem {n} ma",
    productTitleTpl:"Ma {title} - {brand} 2026",
    productMetaDescTpl:"Ma giam gia {title} tai {brand} - da kiem tra, cap nhat thuong xuyen. Bam de xem va sao chep.",
    codesHeading:"Cac ma hien co",
    dealNotFoundTitle:"Khong tim thay uu dai",
    dealNotFoundSub:"Khong tim thay uu dai nay. Xem tat ca ma giam gia hien co.",
    pageNotFoundTitle:"Khong tim thay trang",
    pageNotFoundSub:"Khong tim thay trang nay.",
    categoryHeroTitleTpl:"Ma giam gia {category}",
    categoryTitleTpl:"Ma giam gia {category} 2026 | Uu dai da kiem tra",
    categoryMetaDescTpl:"Xem cac ma giam gia {category} da kiem tra, cap nhat thuong xuyen. Bam de xem va luu.",
    categoryHeroSubTpl:"Ma giam gia va uu dai da kiem tra cho danh muc {category}, cap nhat thuong xuyen. Bam de hien ma.",
    categoryNotFoundTitle:"Khong tim thay danh muc",
    categoryNotFoundSub:"Khong tim thay danh muc nay. Xem tat ca ma giam gia hien co.",
    navBlog:"Blog",
    blogPageTitle:"Blog | Defio Coupon",
    blogPageMetaDesc:"Meo mua sam, tong hop uu dai va cau chuyen tu doi ngu Defio Coupon.",
    blogHeroTitle:"Blog Defio Coupon",
    blogHeroSub:"Meo mua sam, tong hop uu dai va cau chuyen tu doi ngu chung toi.",
    blogEmpty:"Chua co bai blog nao.",
    blogPostNotFoundTitle:"Khong tim thay bai viet",
    blogPostNotFoundSub:"Khong tim thay bai viet nay. Xem tat ca bai viet khac.",
    backToBlog:"Ve trang blog",
    catAllIcon:"🗂️",
    trustSecure:"An toan bao mat",trustVerified:"Ma da kiem tra",trustDaily:"Cap nhat hang ngay",trustFree:"Mien phi su dung",
    howTitle:"Cach su dung",
    howStep1Title:"Tim cua hang hoac ma",howStep1Sub:"Tim kiem hoac duyet theo danh muc de tim uu dai ban muon.",
    howStep2Title:"Bam de hien ma",howStep2Sub:"Nhan ma ngay lap tuc va sao chep chi voi 1 cu nhap.",
    howStep3Title:"Tiet kiem khi thanh toan",howStep3Sub:"Dan ma tai cua hang yeu thich va huong uu dai.",
    featuredTitle:"🔥 Uu dai noi bat tuan nay",
    navAbout:"Gioi thieu",footCategories:"Danh muc"}
};

/* ================================================================
   NOI DUNG MAC DINH cho About / Privacy / Terms (tieng Anh, tu viet).
   Neu tab Sheet "Trang tinh" co dong trung slug, noi dung tu Sheet se
   duoc dung thay the (de anh tu sua sau nay ma khong can sua code).
   Dinh dang: dong bat dau "## " la tieu de phu (h2), con lai la doan van.
   ================================================================ */
const FALLBACK_PAGES = {
  "about": {
    title: "About Defio Coupon",
    metaDesc: "Learn about Defio Coupon, a trusted source for verified coupon codes and quality-checked deals on physical and digital products.",
    content: "## Who We Are\nDefio Coupon is an independent coupon and deals platform built for shoppers who want real savings without wasting time. We bring together promo codes, discount vouchers, and verified deals for both physical products and digital services in one simple, searchable place.\n\n## Our Mission\nOur goal is simple: help you save money quickly and safely. Instead of digging through outdated forums or unreliable pop-up sites, you can search or browse by category, click once to reveal a code, and check out with confidence.\n\n## How We Verify Codes\nEvery code and deal listed on Defio Coupon goes through a review step before it is published. We check that the offer is active, that the terms are clearly stated, and that the link leads to the merchant's official checkout or offer page. Codes that repeatedly fail to work are removed or flagged so our listings stay reliable.\n\n## What We Cover\nWe list savings across a wide range of categories, from physical products like electronics, home goods, and fashion, to digital products such as software, subscriptions, and online services. New brands and offers are added regularly.\n\n## How We Make Money\nDefio Coupon is free to use. When you click through a code or deal and make a purchase, we may earn a small commission from our retail partners at no extra cost to you. This is how we keep the site running and free, and it never affects which deals we choose to show you or how we rank them.\n\n## Get In Touch\nHave a code that is not working, or a store you would like to see listed? We would love to hear from you - reach out anytime through our Contact page."
  },
  "privacy-policy": {
    title: "Privacy Policy",
    metaDesc: "Read the Defio Coupon privacy policy to learn how we collect, use, and protect information when you visit our site.",
    content: "## Introduction\nThis Privacy Policy explains how Defio Coupon (\"we\", \"us\", or \"our\") collects, uses, and protects information when you visit defiocoupon.com (the \"Site\"). By using the Site, you agree to the practices described in this policy.\n\n## Information We Collect\nWe collect limited information automatically when you visit the Site, such as browser type, device type, general location, and pages viewed. We do not require you to create an account or provide personal information to browse coupons or deals.\n\n## Cookies and Tracking Technologies\nThe Site may use cookies and similar technologies to remember your preferences, understand how visitors use the Site, and measure the performance of the coupons and deals we list. You can disable cookies in your browser settings, though some features of the Site may not work as intended.\n\n## How We Use Information\nInformation we collect is used to operate and improve the Site, understand which offers are most useful to visitors, and detect and prevent abuse. We do not sell your personal information to third parties.\n\n## Affiliate Links and Third-Party Sites\nMany links on this Site are affiliate links that take you to a merchant's website. Once you leave Defio Coupon, your activity is subject to that merchant's own privacy policy and terms, which we do not control. We encourage you to review the privacy practices of any site you visit through our links.\n\n## Data Security\nWe take reasonable measures to protect the information collected through the Site. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.\n\n## Children's Privacy\nThe Site is not directed at children under 13, and we do not knowingly collect personal information from children.\n\n## Changes to This Policy\nWe may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.\n\n## Contact Us\nIf you have questions about this Privacy Policy, please reach out through our Contact page."
  },
  "terms-of-use": {
    title: "Terms of Use",
    metaDesc: "Read the Terms of Use for Defio Coupon, including how coupon accuracy, affiliate links, and liability are handled.",
    content: "## Acceptance of Terms\nBy accessing or using defiocoupon.com (the \"Site\"), you agree to be bound by these Terms of Use. If you do not agree with these terms, please do not use the Site.\n\n## Use of the Site\nThe Site is provided for personal, non-commercial use. You agree not to misuse the Site, including attempting to disrupt its operation, scrape content at scale, or use it for any unlawful purpose.\n\n## Accuracy of Coupons and Deals\nWe make reasonable efforts to keep coupon codes, discounts, and deals accurate and up to date. However, offers are set by third-party merchants and may change, expire, or be restricted without notice. Defio Coupon does not guarantee that any code or deal will work at checkout.\n\n## Affiliate Disclosure\nDefio Coupon participates in affiliate marketing programs. This means we may earn a commission when you click a link on the Site and make a qualifying purchase, at no additional cost to you. Affiliate relationships do not influence the accuracy of the information we provide.\n\n## Intellectual Property\nAll content on the Site, including text, graphics, logos, and design, is the property of Defio Coupon or its licensors, except for third-party trademarks and logos which remain the property of their respective owners.\n\n## Limitation of Liability\nThe Site and its content are provided \"as is\" without warranties of any kind. Defio Coupon is not liable for any loss or damage arising from your use of the Site or reliance on any coupon, deal, or information listed on it.\n\n## Links to Third-Party Sites\nThe Site contains links to third-party merchant websites. We are not responsible for the content, policies, or practices of any third-party site linked from Defio Coupon.\n\n## Changes to These Terms\nWe may revise these Terms of Use at any time. Continued use of the Site after changes are posted constitutes acceptance of the updated terms.\n\n## Governing Law\nThese Terms are governed by applicable law without regard to conflict of law principles.\n\n## Contact Us\nQuestions about these Terms of Use can be sent to us through our Contact page."
  },
  "contact": {
    title: "Contact Us",
    metaDesc: "Get in touch with the Defio Coupon team.",
    content: "## We'd Love to Hear From You\nFound a coupon that is not working, want to suggest a store, or have a question about Defio Coupon? Reach out anytime at taiflows@defio.io and we'll get back to you as soon as we can."
  }
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

/* Escape du lieu tu Google Sheet truoc khi chen vao HTML, tranh XSS
   (ai do sua Sheet chua the <script> hoac dau nhay pha vo thuoc tinh). */
function escapeHTML(s){
  return (s==null?'':String(s))
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

/* Nhan biet dong bat dau bang emoji (cac khoi Unicode emoji pho bien). */
function isEmojiLine(line){
  return /^[\u{1F000}-\u{1FFFF}\u{2190}-\u{27BF}\u{2B00}-\u{2BFF}]/u.test(line);
}

/* Parser markdown-lite cho cot "Danh gia": dong **in dam** -> tieu de phu,
   dong bat dau bang emoji -> gom thanh danh sach, con lai -> doan van.
   Tat ca noi dung deu duoc escape HTML truoc khi chen vao trang. */
function renderReviewMarkdown(raw){
  if(!raw) return '';
  const lines=raw.split(/\r?\n/).map(function(l){return l.trim()}).filter(function(l){return l.length>0});
  let html='', inList=false;
  lines.forEach(function(line){
    const bold=line.match(/^\*\*(.+?)\*\*$/);
    if(bold){
      if(inList){html+='</ul>';inList=false;}
      html+='<h4 class="review-heading">'+escapeHTML(bold[1])+'</h4>';
    }else if(isEmojiLine(line)){
      if(!inList){html+='<ul class="review-list">';inList=true;}
      html+='<li>'+escapeHTML(line)+'</li>';
    }else{
      if(inList){html+='</ul>';inList=false;}
      html+='<p class="review-text">'+escapeHTML(line)+'</p>';
    }
  });
  if(inList)html+='</ul>';
  return html;
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
        {brand:"Sirui",logo:"",productSlug:"",title:"Enjoy Fast Savings 5% Off",desc:"Get Sirui promo code at checkout and enjoy 5% off.",code:"UPA-TAINGUYENNHU",url:"#",discount:"5%",categoryRaw:"Tech & Electronics",image:"",rating:"",review:""},
        {brand:"Soulflower",logo:"",productSlug:"",title:"Top Coupon Codes Today",desc:"Save 5% off on all products with Soulflower coupon.",code:"SHMEDIA",url:"#",discount:"5%",categoryRaw:"Health & Beauty",image:"",rating:"",review:""}
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
        productSlug:(r[COL.productSlug]||"").trim(),
        title:(r[COL.title]||"").trim(),
        desc:(r[COL.desc]||"").trim(),
        code:(r[COL.code]||"").trim(),
        url:(r[COL.url]||"#").trim(),
        discount:(r[COL.discount]||"").trim(),
        categoryRaw:(r[COL.category]||"").trim(),
        image:(r[COL.image]||"").trim(),
        rating:(r[COL.rating]||"").toString().trim().replace(',', '.'),
        review:(r[COL.review]||"").trim()
      };
    }).filter(function(c){return c.brand});
    const brands = rowsB.map(function(r){
      return {name:(r[BRAND_COL.name]||"").trim(), img:(r[BRAND_COL.img]||"").trim()};
    }).filter(function(b){return b.img});
    return {coupons:coupons, brands:brands};
  });
}

/* Lay noi dung trang tinh (About/Privacy/Terms...) tu Sheet neu co,
   khong thi dung FALLBACK_PAGES co san trong code. */
function fetchPage(slug){
  const fallback = FALLBACK_PAGES[slug] || null;
  if(!SHEET_PAGES_URL) return Promise.resolve(fallback);
  return fetch(SHEET_PAGES_URL).then(function(r){return r.json()}).then(function(rows){
    const row=(rows||[]).find(function(r){return (r[PAGE_COL.slug]||"").trim().toLowerCase()===slug;});
    if(!row || !(row[PAGE_COL.content]||"").trim()) return fallback;
    return {
      title:(row[PAGE_COL.title]||"").trim() || (fallback?fallback.title:slug),
      metaDesc:(row[PAGE_COL.metaDesc]||"").trim() || (fallback?fallback.metaDesc:""),
      content:(row[PAGE_COL.content]||"").trim()
    };
  }).catch(function(){ return fallback; });
}

function renderPageContent(raw){
  return raw.split(/\n+/).map(function(line){
    line=line.trim();
    if(!line) return '';
    if(line.indexOf('## ')===0) return '<h2>'+escapeHTML(line.slice(3))+'</h2>';
    return '<p>'+escapeHTML(line)+'</p>';
  }).join('');
}

/* Lay danh sach bai Blog tu Sheet. Nhieu dong cung "Ten Du An" duoc gom
   thanh 1 bai voi nhieu anh (moi dong 1 anh) - "Noi Dung" chi can dien
   o 1 dong bat ky trong nhom, dong khac de trong. */
function fetchBlogPosts(){
  if(!SHEET_BLOG_URL) return Promise.resolve([]);
  return fetch(SHEET_BLOG_URL).then(function(r){return r.json()}).then(function(rows){
    const map={}, order=[];
    (rows||[]).forEach(function(r){
      const project=(r[BLOG_COL.project]||"").trim();
      if(!project) return;
      const image=(r[BLOG_COL.image]||"").trim();
      const content=(r[BLOG_COL.content]||"").trim();
      const key=slugify(project);
      if(!map[key]){
        map[key]={slug:key, title:project, content:"", images:[]};
        order.push(key);
      }
      if(image) map[key].images.push(image);
      if(!map[key].content && content) map[key].content=content;
    });
    return order.map(function(k){return map[k]});
  }).catch(function(){ return []; });
}

function blogCardHTML(post, t){
  const cover=post.images[0]
    ? '<img class="blog-cover" src="'+escapeHTML(post.images[0])+'" alt="'+escapeHTML(post.title)+'" loading="lazy">'
    : '';
  return '<a class="blog-card" href="/blog/'+encodeURIComponent(post.slug)+'">'+cover+'<h3>'+escapeHTML(post.title)+'</h3></a>';
}

function blogGalleryHTML(images){
  if(!images.length) return '';
  return '<div class="blog-gallery">'+images.map(function(img){
    return '<img src="'+escapeHTML(img)+'" alt="" loading="lazy">';
  }).join('')+'</div>';
}

/* Gom cac dong coupon (moi dong = 1 ma) thanh cac SAN PHAM.
   Cac dong cung Brand + "Ma san pham" (hoac cung tieu de neu de trong o
   Ma san pham) duoc gom vao 1 trang san pham voi nhieu ma. Anh/so sao/
   danh gia chi can dien o 1 dong bat ky trong nhom, cac dong khac de trong. */
function productKey(brand, productSlugRaw, title){
  return slugify(brand) + '--' + (productSlugRaw ? slugify(productSlugRaw) : slugify(title));
}

/* URL /coupons/xxx dung slug NGAN: ten thuong hieu + "Ma san pham" (neu
   Sheet co dien), khong noi them tieu de day du nhu key gom nhom o tren.
   Neu 2 san pham cung thuong hieu ra cung 1 slug ngan (vi du deu de trong
   Ma san pham), tu dong them -2, -3... de tranh trung URL. */
function groupToProducts(coupons){
  const map={}, order=[];
  coupons.forEach(function(c){
    const key=productKey(c.brand, c.productSlug, c.title);
    if(!map[key]){
      map[key]={brand:c.brand, logo:c.logo, title:c.title, desc:c.desc, categoryRaw:c.categoryRaw,
        productSlug:c.productSlug, image:"", rating:"", review:"", offers:[]};
      order.push(key);
    }
    if(!map[key].logo && c.logo) map[key].logo=c.logo;
    if(!map[key].categoryRaw && c.categoryRaw) map[key].categoryRaw=c.categoryRaw;
    if(!map[key].productSlug && c.productSlug) map[key].productSlug=c.productSlug;
    if(!map[key].image && c.image) map[key].image=c.image;
    if(!map[key].rating && c.rating) map[key].rating=c.rating;
    if(!map[key].review && c.review) map[key].review=c.review;
    if(c.code || (c.url && c.url!=='#')) map[key].offers.push({code:c.code, discount:c.discount, url:c.url});
  });
  const usedSlugs={};
  return order.map(function(k){
    const p=map[k];
    p.categories=resolveCategories(p.categoryRaw);
    delete p.categoryRaw;
    const base=slugify(p.brand)+(p.productSlug?'-'+slugify(p.productSlug):'');
    let slug=base, n=2;
    while(usedSlugs[slug]){ slug=base+'-'+n; n++; }
    usedSlugs[slug]=true;
    p.slug=slug;
    return p;
  }).filter(function(p){return p.offers.length;});
}

function renderMarquee(brands, marqueeEl, trackEl){
  if(!brands.length){marqueeEl.style.display='none';return;}
  marqueeEl.style.display='';
  const one=brands.map(function(b){
    return '<div class="marquee-item"><img src="'+escapeHTML(b.img)+'" alt="'+escapeHTML(b.name)+'" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></div>';
  }).join('');
  trackEl.innerHTML=one+one;
}

/* The card tren trang chu / trang brand / trang danh muc: la link dan
   sang trang lay ma rieng cua tao (/coupons/xxx), dieu huong CUNG mot tab
   (khong mo tab moi). Affiliate chi mo khi khach tu bam "Visit Store"
   ngay tren trang /coupons/xxx sau khi da xem ma (xem attachCodeEvents). */
function productCardHTML(p, t){
  const logo=p.logo
    ? '<img class="brand-logo" src="'+escapeHTML(p.logo)+'" alt="'+escapeHTML(p.brand)+'" loading="lazy" onerror="this.outerHTML=\'<div class=\\\'brand-fallback\\\'>'+escapeHTML(p.brand.charAt(0))+'</div>\'">'
    : '<div class="brand-fallback">'+escapeHTML(p.brand.charAt(0))+'</div>';
  const tags='<div class="tag-row">'+p.categories.map(function(slug){return '<span class="tag">'+escapeHTML(categoryLabel(slug))+'</span>'}).join('')+'</div>';
  const bestDiscount=(p.offers.map(function(o){return o.discount}).filter(Boolean)[0])||'';
  const disc=bestDiscount?'<span class="discount">'+escapeHTML(bestDiscount)+'</span>':'';
  const btnLabel=p.offers.length>1 ? tpl(t.viewCodesTpl,{n:p.offers.length}) : t.viewDeal;
  return '<a class="card" href="/coupons/'+encodeURIComponent(p.slug)+'"><div class="card-top">'+logo+'<div style="min-width:0">'+tags+'<div class="brand-name">'+escapeHTML(p.brand)+'</div></div>'+disc+'</div><h3>'+escapeHTML(p.title)+'</h3><p class="desc">'+escapeHTML(p.desc)+'</p><div class="deal-btn">'+escapeHTML(btnLabel)+'</div></a>';
}

/* Dong hien thi 1 ma / 1 uu dai ben trong trang san pham. Nut "Visit Store"
   luon co san trong HTML nhung an bang CSS (.offer-visit-link) cho toi khi
   ma duoc hien (xem attachCodeEvents them class "revealed"). */
function offerRowHTML(offer, t, ctx){
  ctx=ctx||{};
  const brandInitial=escapeHTML((ctx.brand||'?').charAt(0));
  const logo=ctx.logo
    ? '<img src="'+escapeHTML(ctx.logo)+'" alt="'+escapeHTML(ctx.brand||'')+'" loading="lazy" onerror="this.outerHTML=\'<div class=\\\'offer-logo-fallback\\\'>'+brandInitial+'</div>\'">'
    : '<div class="offer-logo-fallback">'+brandInitial+'</div>';
  const disc=offer.discount?'<span class="discount">'+escapeHTML(offer.discount)+'</span>':'';
  const badges='<div class="offer-badges">'+disc+'<span class="badge-verified">&#10003; '+escapeHTML(t.verifiedBadge)+'</span></div>';
  const left='<div class="offer-card-left">'+logo+'<span class="offer-tag">'+escapeHTML(offer.code?t.codeTag:t.dealTag)+'</span></div>';
  if(offer.code){
    return '<div class="offer-card">'+left
      +'<div class="offer-card-mid">'+badges+'<div class="code-preview">'+escapeHTML(offer.code)+'</div></div>'
      +'<div class="offer-cta-group">'
        +'<button type="button" class="offer-cta code-btn" data-code="'+escapeHTML(offer.code)+'">'+escapeHTML(t.reveal)+'</button>'
        +'<a class="offer-visit-link" href="'+escapeHTML(offer.url)+'" target="_blank" rel="nofollow noopener sponsored">'+escapeHTML(t.visitStore)+'</a>'
      +'</div>'
      +'</div>';
  }
  return '<div class="offer-card">'+left
    +'<div class="offer-card-mid">'+badges+'</div>'
    +'<a class="offer-cta deal-btn" href="'+escapeHTML(offer.url)+'" target="_blank" rel="nofollow noopener sponsored">'+escapeHTML(t.deal)+'</a>'
    +'</div>';
}

/* Ve thanh sao ty le theo so thap phan (vd 4.5/5), khong can anh. */
function starsHTML(rating){
  const num=parseFloat(rating);
  if(!num || isNaN(num)) return '';
  const pct=Math.max(0,Math.min(5,num))/5*100;
  return '<span class="stars" aria-label="'+num+'/5"><span class="stars-bg">★★★★★</span><span class="stars-fill" style="width:'+pct+'%">★★★★★</span></span>';
}

/* The danh gia san pham (anh + sao + doan review), hien ben canh/duoi
   danh sach ma tren trang san pham. Chi hien khi Sheet co du lieu. */
function reviewCardHTML(p){
  if(!p.rating && !p.review && !p.image) return '';
  const logoBox=p.logo?'<div class="review-logo-box"><img src="'+escapeHTML(p.logo)+'" alt="'+escapeHTML(p.brand)+'"></div>':'';
  const stars=starsHTML(p.rating);
  const ratingRow=stars?'<div class="rating-row">'+stars+'<span class="rating-num">'+parseFloat(p.rating).toFixed(1)+'/5</span></div>':'';
  const divider=(p.rating||p.review)?'<hr class="review-divider">':'';
  const img=p.image?'<img class="review-img" src="'+escapeHTML(p.image)+'" alt="'+escapeHTML(p.title)+'" loading="lazy">':'';
  const review=renderReviewMarkdown(p.review);
  return '<aside class="review-card">'+logoBox+'<div class="review-brand">'+escapeHTML(p.brand)+'</div>'+ratingRow+divider+img+review+'</aside>';
}

/* Nut "Get Code" tren trang /coupons/xxx: bam vao la hien ma + tu dong
   copy ngay, khong mo tab/cua so nao ca. Nut "Visit Store" (an san trong
   HTML, xem offerRowHTML) chi hien ra SAU khi ma da duoc hien - khach tu
   bam nut do (link that, trinh duyet tu mo tab moi binh thuong) thi moi
   sang trang affiliate. */
function attachCodeEvents(gridEl){
  gridEl.addEventListener('click',function(e){
    const btn=e.target.closest('.code-btn');if(!btn)return;
    const code=btn.dataset.code, t=UI[lang];
    const card=btn.closest('.offer-card');
    const preview=card?card.querySelector('.code-preview'):null;
    const visitLink=card?card.querySelector('.offer-visit-link'):null;
    if(!btn.classList.contains('revealed')){
      btn.classList.add('revealed');
      if(preview)preview.classList.add('revealed');
      if(visitLink)visitLink.classList.add('revealed');
      btn.textContent=t.copy;
    }
    /* Trinh duyet chan quyen copy thi van bao ma de khach tu chep */
    var fallback=function(){showToast('Your code: '+code)};
    if(navigator.clipboard)navigator.clipboard.writeText(code).then(function(){showToast(t.copied+code)},fallback);
    else fallback();
  });
}

function applyFooterUI(t){
  const set=function(id,val){const el=document.getElementById(id);if(el)el.textContent=val;};
  set('footTag',t.footTag);set('footInfo',t.footInfo);set('footAbout',t.footAbout);
  set('footPrivacy',t.footPrivacy);set('footTerms',t.footTerms);set('footContact',t.footContact);
  set('footBlog',t.navBlog);set('footNote',t.footNote);set('footCategories',t.footCategories);
  const catGrid=document.getElementById('footCatGrid');
  if(catGrid){
    catGrid.innerHTML=CATEGORIES.map(function(c){
      const label=lang==='vi'?c.vi:c.en;
      return '<a href="/category/'+c.slug+'">'+escapeHTML(label)+'</a>';
    }).join('');
  }
}

/* Structured data: mo ta cac san pham bang schema.org, khong bia dat gia/tien te
   de tranh bi Google Search Console canh bao structured-data sai. */
function buildCouponJsonLd(products){
  const origin=location.origin;
  return {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "itemListElement": products.map(function(p,i){
      return {
        "@type":"ListItem",
        "position": i+1,
        "item":{
          "@type":"Offer",
          "name": p.title,
          "description": p.desc,
          "url": origin + '/coupons/' + p.slug,
          "category": p.categories.join(', '),
          "seller":{"@type":"Organization","name":p.brand}
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
