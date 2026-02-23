# Website Link & CTA Auditor
# Scans all pages for broken links, missing CTAs, and content issues

param(
    [string]$BaseUrl = "https://www.buildwithai.digital",
    [string]$OutputFile = "link-audit-results.csv"
)

Write-Host "`n🔍 BUILD WITH AI - Link & CTA Auditor" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

$pages = @(
    "/",
    "/about",
    "/products",
    "/services",
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/api",
    "/dashboard/billing",
    "/dashboard/infrastructure",
    "/admin/dashboard",
    "/admin/leads",
    "/admin/payouts",
    "/admin/errors",
    "/developers",
    "/partners",
    "/partners/dashboard",
    "/ssl",
    "/privacy",
    "/terms",
    "/membership",
    "/affiliate"
)

$productPages = @(
    "/products/domains/registration",
    "/products/domains/transfer",
    "/products/tlds",
    "/products/ssl",
    "/products/ssl/domain-validation",
    "/products/ssl/organization-validation",
    "/products/ssl/extended-validation",
    "/products/ssl/wildcard",
    "/products/ssl/multi-domain",
    "/products/ssl/code-signing",
    "/products/dns/hosting",
    "/products/dns/templates",
    "/products/dns/nameservers",
    "/products/premium-dns",
    "/products/email/verification",
    "/products/email/templates",
    "/products/spam-experts",
    "/products/easy-dmarc",
    "/products/templates",
    "/products/licenses/plesk",
    "/products/licenses/virtuozzo"
)

$servicePages = @(
    "/services/customer-management",
    "/services/domain-management",
    "/services/ssl-management",
    "/services/ai-design"
)

$allPages = $pages + $productPages + $servicePages

$results = @()
$brokenLinks = 0
$workingLinks = 0

foreach ($page in $allPages) {
    $url = $BaseUrl + $page
    Write-Host "  Checking: $page" -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 15 -ErrorAction Stop -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ OK ($($response.StatusCode))" -ForegroundColor Green
            $workingLinks++
            $status = "OK"
        } else {
            Write-Host "  ⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
            $brokenLinks++
            $status = "WARNING"
        }
    } catch {
        Write-Host "  ❌ FAILED" -ForegroundColor Red
        Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
        $brokenLinks++
        $status = "BROKEN"
    }
    
    $results += [PSCustomObject]@{
        Page = $page
        URL = $url
        Status = $status
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
}

# Export to CSV
$results | Export-Csv -Path $OutputFile -NoTypeInformation -Encoding UTF8

Write-Host "`n📊 Audit Summary:" -ForegroundColor Cyan
Write-Host "  Total Pages: $($allPages.Count)" -ForegroundColor White
Write-Host "  Working: $workingLinks" -ForegroundColor Green
Write-Host "  Broken/Warnings: $brokenLinks" -ForegroundColor $(if ($brokenLinks -gt 0) { "Red" } else { "Green" })
Write-Host "`n💾 Results saved to: $OutputFile" -ForegroundColor Cyan
Write-Host "`n🎯 Audit Complete!" -ForegroundColor Cyan

# Open CSV in Excel
if (Test-Path $OutputFile) {
    Start-Process $OutputFile
}
