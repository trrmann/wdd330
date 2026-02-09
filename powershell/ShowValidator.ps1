# ShowValidator.ps1
# Opens W3C HTML, CSS, or WAVE Accessibility validator in the default browser based on provided switches.
# Usage: .\ShowValidator.ps1 [-HTML] [-CSS] [-Accessibility]

param(
    [switch]$HTML,
    [switch]$CSS,
    [switch]$Accessibility,
    [string]$Url = ""
)

if ($HTML) {
    if ($Url) {
        $validateUrl = "https://validator.w3.org/?uri=$Url"
    } else {
        $validateUrl = "https://validator.w3.org/"
    }
    Write-Host "Opening W3C HTML Validator..."
    Start-Process $validateUrl
}

if ($CSS) {
    if ($Url) {
        $validateUrl = "https://jigsaw.w3.org/css-validator/validator?uri=$Url"
    } else {
        $validateUrl = "https://jigsaw.w3.org/css-validator/"
    }
    Write-Host "Opening W3C CSS Validator..."
    Start-Process $validateUrl
}

if ($Accessibility) {
    if ($Url) {
        $validateUrl = "https://wave.webaim.org/report#/$Url"
    } else {
        $validateUrl = "https://wave.webaim.org/"
    }
    Write-Host "Opening WAVE Accessibility Checker..."
    Start-Process $validateUrl
}

if (-not ($HTML -or $CSS -or $Accessibility)) {
    Write-Host "No validator switch provided. Use -HTML, -CSS, or -Accessibility."
    exit 1
}
