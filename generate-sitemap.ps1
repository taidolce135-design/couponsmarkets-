# Chay lai script nay moi khi them brand/san pham moi vao Google Sheet, roi upload sitemap.xml len hosting.
# Cach chay: mo PowerShell trong thu muc project, go:  .\generate-sitemap.ps1

$BaseUrl = "https://defiocoupon.com"   # <-- doi thanh ten mien that cua anh
$SheetCouponsUrl = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/M%C3%A3%20Coupon"
$SheetBlogUrl = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/B%C3%A0i%20Blog"

function Slugify([string]$s) {
    $s = $s.ToLowerInvariant()
    $s = [regex]::Replace($s, '[^a-z0-9]+', '-')
    return $s.Trim('-')
}

Write-Host "Dang tai du lieu tu Google Sheet..."
$rows = Invoke-RestMethod -Uri $SheetCouponsUrl

$brands = $rows |
    ForEach-Object { $_.Brand } |
    Where-Object { $_ -and $_.Trim() -ne "" } |
    ForEach-Object { $_.Trim() } |
    Sort-Object -Unique

# Gom theo san pham: cung Brand + "Ma san pham" (hoac cung tieu de neu de trong) = 1 trang /coupons/xxx.
# Key gom nhom (detailKey) dung day du de khong gop nham 2 san pham khac nhau; slug URL thuc te
# thi NGAN hon - chi Brand + "Ma san pham" - va tu them -2, -3... neu bi trung giua cac san pham.
$productOrder = New-Object System.Collections.Generic.List[string]
$productInfo = @{}
foreach ($r in $rows) {
    $brand = ("" + $r.Brand).Trim()
    if (-not $brand) { continue }
    $productSlugRaw = ("" + $r.'Mã sản phẩm').Trim()
    $title = ("" + $r.'Tiêu đề tiếng Anh').Trim()
    $part = if ($productSlugRaw) { Slugify $productSlugRaw } else { Slugify $title }
    $detailKey = (Slugify $brand) + "--" + $part
    if ($detailKey -eq "--") { continue }
    if (-not $productInfo.ContainsKey($detailKey)) {
        $productInfo[$detailKey] = @{ Brand = $brand; ProductSlugRaw = $productSlugRaw }
        [void]$productOrder.Add($detailKey)
    } elseif (-not $productInfo[$detailKey].ProductSlugRaw -and $productSlugRaw) {
        $productInfo[$detailKey].ProductSlugRaw = $productSlugRaw
    }
}

$usedSlugs = @{}
$couponSlugs = New-Object System.Collections.Generic.List[string]
foreach ($detailKey in $productOrder) {
    $info = $productInfo[$detailKey]
    $base = Slugify $info.Brand
    if ($info.ProductSlugRaw) { $base = $base + "-" + (Slugify $info.ProductSlugRaw) }
    $slug = $base
    $n = 2
    while ($usedSlugs.ContainsKey($slug)) { $slug = "$base-$n"; $n++ }
    $usedSlugs[$slug] = $true
    [void]$couponSlugs.Add($slug)
}

# Gom bai Blog theo "Ten Du An" (moi dong = 1 anh, cung ten = 1 bai)
$blogSlugs = New-Object System.Collections.Generic.List[string]
$blogSeen = @{}
try {
    $blogRows = Invoke-RestMethod -Uri $SheetBlogUrl
    foreach ($r in $blogRows) {
        $project = ("" + $r.'Tên Dự Án').Trim()
        if (-not $project) { continue }
        $slug = Slugify $project
        if ($slug -eq "" -or $blogSeen.ContainsKey($slug)) { continue }
        $blogSeen[$slug] = $true
        [void]$blogSlugs.Add($slug)
    }
} catch {
    Write-Host "Khong doc duoc tab Bai Blog (co the chua co du lieu), bo qua."
}

$today = Get-Date -Format "yyyy-MM-dd"

# 12 danh muc co dinh (phai khop voi mang CATEGORIES trong assets/data.js)
$categorySlugs = @(
    "arts-entertainment","business","clothing-accessories","food-gifts",
    "health-beauty","home-garden","life-family","sports-fitness",
    "tech-electronics","travel","ai-saas","other"
)

$urls = @()
$urls += "  <url>`n    <loc>$BaseUrl/</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>daily</changefreq>`n    <priority>1.0</priority>`n  </url>"

foreach ($slug in @("about","privacy-policy","terms-of-use","contact")) {
    $urls += "  <url>`n    <loc>$BaseUrl/$slug</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>monthly</changefreq>`n    <priority>0.3</priority>`n  </url>"
}

foreach ($slug in $categorySlugs) {
    $urls += "  <url>`n    <loc>$BaseUrl/category/$slug</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.5</priority>`n  </url>"
}

foreach ($b in $brands) {
    $slug = Slugify $b
    if ($slug -eq "") { continue }
    $urls += "  <url>`n    <loc>$BaseUrl/site/$slug</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.7</priority>`n  </url>"
}

foreach ($slug in $couponSlugs) {
    $urls += "  <url>`n    <loc>$BaseUrl/coupons/$slug</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.6</priority>`n  </url>"
}

$urls += "  <url>`n    <loc>$BaseUrl/blog</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.5</priority>`n  </url>"
foreach ($slug in $blogSlugs) {
    $urls += "  <url>`n    <loc>$BaseUrl/blog/$slug</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>monthly</changefreq>`n    <priority>0.4</priority>`n  </url>"
}

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<!-- File nay duoc tao/cap nhat tu dong boi generate-sitemap.ps1.
     Sau khi them brand/san pham moi vao Sheet, chay lai script do roi upload lai sitemap.xml. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($urls -join "`n")
</urlset>
"@

$outPath = Join-Path $PSScriptRoot "sitemap.xml"
$xml | Set-Content -Path $outPath -Encoding utf8
Write-Host "Da ghi $outPath voi $($urls.Count) URL (1 trang chu, 4 trang tinh, 12 danh muc, $($brands.Count) cua hang, $($couponSlugs.Count) san pham, $($blogSlugs.Count) bai blog)."
