# Chay lai script nay moi khi them brand moi vao Google Sheet, roi upload sitemap.xml len hosting.
# Cach chay: mo PowerShell trong thu muc project, go:  .\generate-sitemap.ps1

$BaseUrl = "https://ten-mien-cua-anh.com"   # <-- doi thanh ten mien that cua anh
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

$today = Get-Date -Format "yyyy-MM-dd"

$urls = @()
$urls += "  <url>`n    <loc>$BaseUrl/</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>daily</changefreq>`n    <priority>1.0</priority>`n  </url>"
foreach ($b in $brands) {
    $slug = Slugify $b
    if ($slug -eq "") { continue }
    $urls += "  <url>`n    <loc>$BaseUrl/site/$slug</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>weekly</changefreq>`n    <priority>0.7</priority>`n  </url>"
}

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<!-- File nay duoc tao/cap nhat tu dong boi generate-sitemap.ps1.
     Sau khi them brand moi vao Sheet, chay lai script do de cap nhat danh sach /site/xxx roi upload lai. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($urls -join "`n")
</urlset>
"@

$outPath = Join-Path $PSScriptRoot "sitemap.xml"
$xml | Set-Content -Path $outPath -Encoding utf8
Write-Host "Da ghi $outPath voi $($brands.Count + 1) URL (1 trang chu + $($brands.Count) cua hang)."
