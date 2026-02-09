## ShowRepo.ps1
# Opens the GitHub repository page in the default browser.
# Usage: .\ShowRepo.ps1

$gitRemote = $(git config --get remote.origin.url)

if (-not $gitRemote) {
    Write-Host "No remote 'origin' found."
    exit 1
}

$repoPath = $null
$webUrl = $null
if ($gitRemote -match "^git@github.com:(.+)\.git$") {
    $repoPath = $Matches[1]
    $webUrl = "https://github.com/$repoPath"
} elseif ($gitRemote -match "^https://github.com/(.+)\.git$") {
    $repoPath = $Matches[1]
    $webUrl = "https://github.com/$repoPath"
}

if ($webUrl) {
    Write-Host "Opening $webUrl in your default browser..."
    Start-Process $webUrl
    exit 0
} else {
    Write-Host "Unrecognized remote URL format: $gitRemote"
    exit 1
}
