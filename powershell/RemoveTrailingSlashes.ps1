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
$inVoidElement = $false
$voidElementName = ""
$startIdx = 0

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    foreach ($element in $voidElements) {
        # Detect start of a multi-line void element
        if ($line -match "<${element}[^>]*$" -and $line -notmatch '/>$') {
            $inVoidElement = $true
            $voidElementName = $element
            $startIdx = $i
        }
        # Single-line void element
        elseif ($line -match "<${element}[^>]*?/>") {
            $lines[$i] = $line -replace '/>$', '>'
        }
    }
    # If inside a multi-line void element, look for end
    if ($inVoidElement -and $line -match '/>$') {
        $lines[$i] = $line -replace '/>$', '>'
        $inVoidElement = $false
        $voidElementName = ""
    }
}
Set-Content -Path $indexPath -Value $lines -Encoding UTF8
Write-Output "Trailing slashes removed from void elements in index.html"
