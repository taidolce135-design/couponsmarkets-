# Chay lai script nay moi khi them brand/san pham moi vao Google Sheet, roi upload sitemap.xml len hosting.
# Cach chay: mo PowerShell trong thu muc project, go:  .\generate-sitemap.ps1

$BaseUrl = "https://couponsmarkets.com"   # <-- doi thanh ten mien that cua anh
$SheetCouponsUrl = "https://opensheet.elk.sh/1jzl1UmcEQBO-LJuOtzLkAiZ1xm5UjjR5v2qOJL3OQ3A/M%C3%A3%20Coupon"

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

# Gom theo san pham: cung Brand + "Ma san pham" (hoac cung tieu de neu de trong) = 1 trang /product/xxx
$productKeys = New-Object System.Collections.Generic.HashSet[string]
foreach ($r in $rows) {
    $brand = ("" + $r.Brand).Trim()
    if (-not $brand) { continue }
    $productSlugRaw = ("" + $r.'Mã sản phẩm').Trim()
    $title = ("" + $r.'Tiêu đề tiếng Anh').Trim()
    $part = if ($productSlugRaw) { Slugify $productSlugRaw } else { Slugify $title }
    $key = (Slugify $brand) + "--" + $part
    if ($key -ne "--") { [void]$productKeys.Add($key) }
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

foreach ($key in $productKeys) {
    $urls += "  <url>`n    <loc>$BaseUrl/product/$key</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.6</priority>`n  </url>"
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
Write-Host "Da ghi $outPath voi $($urls.Count) URL (1 trang chu, 4 trang tinh, 12 danh muc, $($brands.Count) cua hang, $($productKeys.Count) san pham)."
