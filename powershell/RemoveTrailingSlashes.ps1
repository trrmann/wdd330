# RemoveTrailingSlashes.ps1
# This script removes trailing slashes from void elements in index.html for HTML5 compliance.
# It is safe to run standalone or from another PowerShell script.

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$indexPath = Join-Path $projectRoot '../index.html'

if (-Not (Test-Path $indexPath)) {
    Write-Error "index.html not found at $indexPath"
    exit 1
}


# List of HTML5 void elements
$voidElements = @(
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
)



# Read file line by line and only remove '/>' at the end of void element lines
$lines = Get-Content $indexPath
for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    foreach ($element in $voidElements) {
        if ($line -match "<${element}[^>]*?/>") {
            $lines[$i] = $line -replace '/>$', '>'
        }
    }
}
Set-Content -Path $indexPath -Value $lines -Encoding UTF8
Write-Output "Trailing slashes removed from void elements in index.html"
