# ShowValidator.ps1
# Opens W3C HTML, CSS, or WAVE Accessibility validator in the default browser based on provided switches.
# Usage: .\ShowValidator.ps1 [-HTML] [-CSS] [-Accessibility]

param(
    [switch]$HTML,
    [switch]$CSS,
    [switch]$Accessibility
)

if ($HTML) {
    $url = "https://validator.w3.org/"
    Write-Host "Opening W3C HTML Validator..."
    Start-Process $url
}

if ($CSS) {
    $url = "https://jigsaw.w3.org/css-validator/"
    Write-Host "Opening W3C CSS Validator..."
    Start-Process $url
}

if ($Accessibility) {
    $url = "https://wave.webaim.org/"
    Write-Host "Opening WAVE Accessibility Checker..."
    Start-Process $url
}

if (-not ($HTML -or $CSS -or $Accessibility)) {
    Write-Host "No validator switch provided. Use -HTML, -CSS, or -Accessibility."
    exit 1
}
