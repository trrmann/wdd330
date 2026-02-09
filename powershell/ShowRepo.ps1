# ShowRepo.ps1
# Opens the GitHub repository page in the default browser.
# Usage: .\ShowRepo.ps1

# Get the remote URL
gitRemote = git config --get remote.origin.url

if (-not $gitRemote) {
    Write-Host "No remote 'origin' found."
    exit 1
}

# Convert SSH or HTTPS URL to web URL
if ($gitRemote -match "^git@github.com:(.+)\.git$") {
    $repoPath = $Matches[1]
    $webUrl = "https://github.com/$repoPath"
} elseif ($gitRemote -match "^https://github.com/(.+)\.git$") {
    $repoPath = $Matches[1]
    $webUrl = "https://github.com/$repoPath"
} else {
    Write-Host "Unrecognized remote URL format: $gitRemote"
    exit 1
}

Write-Host "Opening $webUrl in your default browser..."
Start-Process $webUrl
